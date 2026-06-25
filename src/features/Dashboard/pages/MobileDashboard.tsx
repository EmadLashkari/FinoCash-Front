import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  BarChart3,
  ChevronLeft,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Receipt,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";

export default function MobileDashboardHome() {
  const params = useParams({ strict: false });
  const schoolId = params.schoolId as string;
  const navigate = useNavigate();
  return (
    <div className="space-y-6 font-sans pb-6" dir="rtl">
      {/* 1. Main Overview & School Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-none bg-white shadow-sm rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Users className="h-5 w-5" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-400 font-medium">
              دانش‌آموزان فعال
            </span>
            <span className="text-base font-black text-slate-800">
              82
            </span>
          </div>
        </Card>

        <Card className="border-none bg-white shadow-sm rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-400 font-medium">
              کلاس‌های تشکیل‌شده
            </span>
            <span className="text-base font-black text-slate-800">۲۴ کلاس</span>
          </div>
        </Card>
      </div>

      {/* 2. Financial Balance Report Card (Neo-banking style representation) */}
      <Card className="border-none bg-white shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="p-5 pb-2">
          <CardTitle className="text-xs font-bold text-slate-400">
            وضعیت کل تراز مالی مدرسه
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-4">
          <div className="flex justify-between items-end border-b border-slate-50 pb-4">
            <div className="space-y-1 text-right">
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> کل دریافتی و بستانکاری
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-800">
                  ۱۸۲,۴۰۰,۰۰۰
                </span>
                <span className="text-[10px] text-slate-400">تومان</span>
              </div>
            </div>

            <div className="space-y-1 text-right">
              <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                <TrendingDown className="h-3 w-3" /> کل مطالبات و بدهی اولیاء
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-800">
                  ۴۵,۶۰۰,۰۰۰
                </span>
                <span className="text-[10px] text-slate-400">تومان</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>نسبت تسویه شهریه‌ها:</span>
            <Badge
              variant="secondary"
              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none font-sans font-bold"
            >
              ۸۰٪ موفق
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 3. School Quick Actions Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 mr-1">دسترسی سریع</h3>

        <div
          onClick={() => {
            navigate({
              to: "/dashboard/$schoolId/invoices/create",
              params: { schoolId: schoolId },
            });
          }}
          className="grid grid-cols-4 lg:grid-cols-5 gap-3"
        >
          <div className="flex flex-col items-center gap-2">
            <Button
              size="icon"
              className="h-14 w-14 rounded-2xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-100/60 shadow-sm transition-transform active:scale-95"
            >
              <FileText className="h-5 w-5 text-orange-500" />
            </Button>
            <span className="text-[10px] font-bold text-slate-600 text-center">
              ثبت فاکتور
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Button
              size="icon"
              className="h-14 w-14 rounded-2xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-100/60 shadow-sm transition-transform active:scale-95"
            >
              <Receipt className="h-5 w-5 text-orange-500" />
            </Button>
            <span className="text-[10px] font-bold text-slate-600 text-center">
              ثبت فیش
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Button
              size="icon"
              className="h-14 w-14 rounded-2xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-100/60 shadow-sm transition-transform active:scale-95"
            >
              <BarChart3 className="h-5 w-5 text-blue-500" />
            </Button>
            <span className="text-[10px] font-bold text-slate-600 text-center">
              گزارش مالی
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Button
              size="icon"
              className="h-14 w-14 rounded-2xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-100/60 shadow-sm transition-transform active:scale-95"
            >
              <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
            </Button>
            <span className="text-[10px] font-bold text-slate-600 text-center">
              لیست بدهکاران
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Button
              size="icon"
              className="h-14 w-14 rounded-2xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-100/60 shadow-sm transition-transform active:scale-95"
            >
              <Users className="h-5 w-5 text-purple-500" />
            </Button>
            <span className="text-[10px] font-bold text-slate-600 text-center">
              ثبت‌نام جدید
            </span>
          </div>
        </div>
      </div>

      {/* 4. Pending Invoices Summary */}
      <Card className="border-none bg-white rounded-3xl shadow-sm">
        <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-sm font-bold text-slate-800">
              آخرین فیش‌های صادر شده
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-blue-600 hover:bg-blue-50 h-8 gap-1 rounded-xl"
          >
            <span>مشاهده همه</span>
            <ChevronLeft className="h-3 w-3" />
          </Button>
        </CardHeader>

        <CardContent className="p-5 pt-0 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Receipt className="h-5 w-5" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-slate-700">
                  فیش شهریه علی علوی
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  پایه پنجم • شناسه #۸۴۹۲
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-black text-slate-700">
                ۴,۵۰۰,۰۰۰ ت
              </span>
              <Badge
                variant="secondary"
                className="text-[9px] bg-amber-50 text-amber-700 border-none rounded-md px-1.5 h-4"
              >
                در انتظار پرداخت
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
