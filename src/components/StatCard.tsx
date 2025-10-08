import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/Card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export function StatCard({ title, value, change, icon: Icon, iconColor, iconBg }: StatCardProps) {
  return (
    <Card hover className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <motion.p
              className="text-3xl font-bold text-slate-900"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              {value}
            </motion.p>
            {change !== undefined && (
              <motion.div
                className="flex items-center gap-1 mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span
                  className={`text-sm font-medium ${
                    change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {change >= 0 ? '+' : ''}
                  {change.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-500">from last month</span>
              </motion.div>
            )}
          </div>

          <motion.div
            className={`${iconBg} p-3 rounded-xl`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
