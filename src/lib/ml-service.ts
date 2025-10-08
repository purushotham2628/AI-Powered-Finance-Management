import { Transaction } from './supabase';

export interface PredictionResult {
  category: string;
  predictedAmount: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface AnomalyDetection {
  isAnomaly: boolean;
  severity: 'low' | 'medium' | 'high';
  description: string;
  expectedRange: { min: number; max: number };
  actualAmount: number;
}

export interface SpendingPattern {
  category: string;
  avgAmount: number;
  frequency: number;
  trend: number;
  seasonality: string;
}

export class MLService {
  private calculateMovingAverage(data: number[], window: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - window + 1);
      const subset = data.slice(start, i + 1);
      const avg = subset.reduce((a, b) => a + b, 0) / subset.length;
      result.push(avg);
    }
    return result;
  }

  private calculateStandardDeviation(values: number[]): number {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  }

  private linearRegression(x: number[], y: number[]): { slope: number; intercept: number } {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  predictNextMonthSpending(transactions: Transaction[], category?: string): PredictionResult[] {
    const categoryMap = new Map<string, Transaction[]>();

    const filteredTransactions = transactions
      .filter(t => t.type === 'expense')
      .filter(t => !category || t.category === category);

    filteredTransactions.forEach(t => {
      if (!categoryMap.has(t.category)) {
        categoryMap.set(t.category, []);
      }
      categoryMap.get(t.category)!.push(t);
    });

    const predictions: PredictionResult[] = [];

    categoryMap.forEach((txns, cat) => {
      if (txns.length < 3) {
        predictions.push({
          category: cat,
          predictedAmount: txns[0]?.amount || 0,
          confidence: 0.3,
          trend: 'stable'
        });
        return;
      }

      const monthlyData = this.groupByMonth(txns);
      const amounts = Array.from(monthlyData.values());

      if (amounts.length < 2) {
        const avgAmount = amounts[0] || 0;
        predictions.push({
          category: cat,
          predictedAmount: avgAmount,
          confidence: 0.5,
          trend: 'stable'
        });
        return;
      }

      const x = amounts.map((_, i) => i);
      const { slope, intercept } = this.linearRegression(x, amounts);
      const predictedAmount = slope * amounts.length + intercept;

      const recentTrend = amounts[amounts.length - 1] - amounts[amounts.length - 2];
      const trend = slope > 5 ? 'increasing' : slope < -5 ? 'decreasing' : 'stable';

      const movingAvg = this.calculateMovingAverage(amounts, Math.min(3, amounts.length));
      const deviation = Math.abs(predictedAmount - movingAvg[movingAvg.length - 1]);
      const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const confidence = Math.max(0.4, 1 - (deviation / avgAmount));

      predictions.push({
        category: cat,
        predictedAmount: Math.max(0, predictedAmount),
        confidence: Math.min(0.95, confidence),
        trend
      });
    });

    return predictions.sort((a, b) => b.predictedAmount - a.predictedAmount);
  }

  detectAnomalies(transactions: Transaction[], category: string): AnomalyDetection[] {
    const categoryTransactions = transactions
      .filter(t => t.category === category && t.type === 'expense')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (categoryTransactions.length < 5) {
      return [];
    }

    const amounts = categoryTransactions.map(t => t.amount);
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const stdDev = this.calculateStandardDeviation(amounts);

    const anomalies: AnomalyDetection[] = [];

    categoryTransactions.forEach(txn => {
      const zScore = Math.abs((txn.amount - mean) / stdDev);

      if (zScore > 2) {
        const severity = zScore > 3 ? 'high' : zScore > 2.5 ? 'medium' : 'low';
        anomalies.push({
          isAnomaly: true,
          severity,
          description: `Unusual ${category} expense detected: $${txn.amount.toFixed(2)} (${txn.title})`,
          expectedRange: {
            min: mean - 2 * stdDev,
            max: mean + 2 * stdDev
          },
          actualAmount: txn.amount
        });
      }
    });

    return anomalies;
  }

  analyzeSpendingPatterns(transactions: Transaction[]): SpendingPattern[] {
    const categoryMap = new Map<string, Transaction[]>();

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (!categoryMap.has(t.category)) {
          categoryMap.set(t.category, []);
        }
        categoryMap.get(t.category)!.push(t);
      });

    const patterns: SpendingPattern[] = [];

    categoryMap.forEach((txns, category) => {
      const amounts = txns.map(t => t.amount);
      const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;

      const monthlyData = this.groupByMonth(txns);
      const frequency = txns.length / Math.max(1, monthlyData.size);

      const monthlyAmounts = Array.from(monthlyData.values());
      let trend = 0;
      if (monthlyAmounts.length >= 2) {
        const x = monthlyAmounts.map((_, i) => i);
        const { slope } = this.linearRegression(x, monthlyAmounts);
        trend = (slope / avgAmount) * 100;
      }

      const seasonality = this.detectSeasonality(txns);

      patterns.push({
        category,
        avgAmount,
        frequency,
        trend,
        seasonality
      });
    });

    return patterns.sort((a, b) => b.avgAmount - a.avgAmount);
  }

  private groupByMonth(transactions: Transaction[]): Map<string, number> {
    const monthlyData = new Map<string, number>();

    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const current = monthlyData.get(monthKey) || 0;
      monthlyData.set(monthKey, current + t.amount);
    });

    return monthlyData;
  }

  private detectSeasonality(transactions: Transaction[]): string {
    const monthCounts = new Array(12).fill(0);

    transactions.forEach(t => {
      const month = new Date(t.date).getMonth();
      monthCounts[month]++;
    });

    const maxCount = Math.max(...monthCounts);
    const avgCount = monthCounts.reduce((a, b) => a + b, 0) / 12;

    if (maxCount > avgCount * 1.5) {
      const peakMonth = monthCounts.indexOf(maxCount);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `Peaks in ${monthNames[peakMonth]}`;
    }

    return 'No clear pattern';
  }

  generateSmartInsights(transactions: Transaction[], budgets: any[]): string[] {
    const insights: string[] = [];

    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const avgTransaction = totalExpenses / expenseTransactions.length;

    const patterns = this.analyzeSpendingPatterns(transactions);

    patterns.slice(0, 3).forEach(pattern => {
      if (pattern.trend > 10) {
        insights.push(`⚠️ Your ${pattern.category} spending is increasing by ${pattern.trend.toFixed(1)}% per month`);
      }
    });

    const predictions = this.predictNextMonthSpending(transactions);
    const totalPredicted = predictions.reduce((sum, p) => sum + p.predictedAmount, 0);

    if (totalPredicted > totalExpenses * 1.1) {
      insights.push(`📈 Based on trends, next month's spending may increase by ${((totalPredicted / totalExpenses - 1) * 100).toFixed(0)}%`);
    }

    const categoryGroups = new Map<string, number>();
    expenseTransactions.forEach(t => {
      categoryGroups.set(t.category, (categoryGroups.get(t.category) || 0) + t.amount);
    });

    const sortedCategories = Array.from(categoryGroups.entries()).sort((a, b) => b[1] - a[1]);
    if (sortedCategories.length > 0 && sortedCategories[0][1] > totalExpenses * 0.3) {
      insights.push(`💡 ${sortedCategories[0][0]} accounts for ${((sortedCategories[0][1] / totalExpenses) * 100).toFixed(0)}% of your spending`);
    }

    return insights;
  }

  categorizeTransaction(title: string, amount: number): string {
    const titleLower = title.toLowerCase();

    const categories: { [key: string]: string[] } = {
      'Food & Dining': ['restaurant', 'food', 'cafe', 'lunch', 'dinner', 'breakfast', 'grocery', 'uber eats', 'doordash', 'grubhub'],
      'Transportation': ['uber', 'lyft', 'gas', 'fuel', 'parking', 'metro', 'bus', 'train', 'taxi', 'vehicle'],
      'Shopping': ['amazon', 'store', 'shop', 'mall', 'purchase', 'buy', 'retail'],
      'Entertainment': ['movie', 'netflix', 'spotify', 'game', 'concert', 'theatre', 'entertainment', 'subscription'],
      'Bills & Utilities': ['electric', 'water', 'internet', 'phone', 'bill', 'utility', 'rent', 'mortgage'],
      'Healthcare': ['doctor', 'hospital', 'pharmacy', 'medical', 'health', 'clinic', 'medicine'],
      'Education': ['school', 'course', 'book', 'tuition', 'education', 'training'],
      'Travel': ['hotel', 'flight', 'airbnb', 'booking', 'travel', 'vacation', 'trip'],
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => titleLower.includes(keyword))) {
        return category;
      }
    }

    return 'Other';
  }
}

export const mlService = new MLService();
