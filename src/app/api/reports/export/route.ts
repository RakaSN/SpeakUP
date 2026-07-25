import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/features/auth/server/auth';
import { ReportService } from '@/features/reports/server/report.service';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate') || undefined;
  const endDate = searchParams.get('endDate') || undefined;
  const categoryId = searchParams.get('categoryId') || undefined;
  const statusId = searchParams.get('statusId') || undefined;

  const csvData = await ReportService.generateExcelCSV({
    startDate,
    endDate,
    categoryId,
    statusId,
  });

  const filename = `Laporan_SpeakUp_${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csvData, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
