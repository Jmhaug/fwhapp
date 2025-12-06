import { useState } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { TrendingDown, TrendingUp, DollarSign, AlertCircle } from 'lucide-react'

export default function FinancialDashboard({ darkMode }) {
  // Customer receivables data from Nes Advantage AS (money owed to the company)
  const customerReceivables = 875875.00

  // Complete income statement data from CSV
  const incomeStatementData = [
    // REVENUE
    { account: '3000', name: 'Salgsinntekt handelsvarer, avgiftspliktig høy sats', value2025: 1374355.70, value2024: 2054754.56, category: 'revenue' },
    { account: '', name: 'Kundefordringer (Nes Advantage AS)', value2025: customerReceivables, value2024: 0, category: 'revenue' },

    // SALARY COSTS
    { account: '5000', name: 'Lønn til ansatte', value2025: 920105.00, value2024: 876185.00, category: 'salary' },
    { account: '5092', name: 'Feriepenger', value2025: 93850.70, value2024: 89370.87, category: 'salary' },
    { account: '5400', name: 'Arbeidsgiveravgift', value2025: 134763.33, value2024: 129738.26, category: 'salary' },
    { account: '5405', name: 'Arbeidsgiveravgift av påløpte feriepenger', value2025: 13232.94, value2024: 12601.30, category: 'salary' },
    { account: '5420', name: 'Innberetningspliktig pensjonskostnad', value2025: 35664.00, value2024: 21742.91, category: 'salary' },
    { account: '5500', name: 'Annen kostnadsgodtgjørelse', value2025: 0.00, value2024: 158.20, category: 'salary' },
    { account: '5920', name: 'Yrkesskadeforsikring', value2025: 1061.00, value2024: 196.00, category: 'salary' },

    // DEPRECIATION
    { account: '6010', name: 'Avskrivning på transportmidler, maskiner og inventar', value2025: 0.00, value2024: 5800.00, category: 'depreciation' },

    // OPERATING EXPENSES
    { account: '6100', name: 'Frakt, transportkostnad og forsikring ved vareforsendelse', value2025: 23.20, value2024: 0.00, category: 'operating' },
    { account: '6300', name: 'Leie lokaler', value2025: 78400.00, value2024: 14000.00, category: 'operating' },
    { account: '6340', name: 'Lys', value2025: 3941.77, value2024: 3654.38, category: 'operating' },
    { account: '6420', name: 'Leie datasystemer', value2025: 11588.61, value2024: 8775.20, category: 'operating' },
    { account: '6540', name: 'Inventar', value2025: 0.00, value2024: 13429.60, category: 'operating' },
    { account: '6560', name: 'Rekvisita', value2025: 2392.00, value2024: 0.00, category: 'operating' },
    { account: '6570', name: 'Arbeidsklær og verneutstyr', value2025: 0.00, value2024: 2458.50, category: 'operating' },
    { account: '6705', name: 'Regnskapshonorar', value2025: 56215.20, value2024: 56366.40, category: 'operating' },
    { account: '6780', name: 'Kjøp tenester utland', value2025: 2835.45, value2024: 0.00, category: 'operating' },
    { account: '6800', name: 'Kontorrekvisita', value2025: 319.20, value2024: 382.40, category: 'operating' },
    { account: '6860', name: 'Møte, kurs, oppdatering o.l.', value2025: 693.60, value2024: 0.00, category: 'operating' },
    { account: '6900', name: 'Telefon', value2025: 6241.28, value2024: 5591.02, category: 'operating' },
    { account: '7100', name: 'Bilgodtgjørelse, oppgavepliktig', value2025: 112.00, value2024: 2782.50, category: 'operating' },
    { account: '7140', name: 'Reisekostnad, ikke oppgavepliktig', value2025: 183118.83, value2024: 108466.83, category: 'operating' },
    { account: '7150', name: 'Diettkostnad, oppgavepliktig', value2025: 1838.20, value2024: 48692.80, category: 'operating' },
    { account: '7160', name: 'Diettkostnad, ikke oppgavepliktig', value2025: 25815.00, value2024: 0.00, category: 'operating' },
    { account: '7420', name: 'Gave, fradragsberettiget', value2025: 10000.00, value2024: 0.00, category: 'operating' },
    { account: '7500', name: 'Forsikringspremie', value2025: 11037.00, value2024: 6865.00, category: 'operating' },
    { account: '7740', name: 'Øreavrunding', value2025: 3.31, value2024: 3.08, category: 'operating' },
    { account: '7770', name: 'Bank- og kortgebyrer', value2025: 3640.50, value2024: 3850.00, category: 'operating' },
    { account: '7790', name: 'Annen kostnad', value2025: 0.00, value2024: -2705.78, category: 'operating' },

    // FINANCIAL INCOME
    { account: '8050', name: 'Renteinntekt bankinnskudd', value2025: 0.00, value2024: 3790.00, category: 'financial_income' },

    // FINANCIAL EXPENSES
    { account: '8140', name: 'Rentekostnad, ikke fradragsberettiget', value2025: 0.00, value2024: 684.00, category: 'financial_expense' },
    { account: '8150', name: 'Annen rentekostnad', value2025: 53.00, value2024: 0.00, category: 'financial_expense' },
    { account: '8155', name: 'Rentekostnad leverandørgjeld', value2025: 68.00, value2024: 308.00, category: 'financial_expense' },

    // TAX
    { account: '8300', name: 'Betalbar skatt', value2025: 0.00, value2024: 144239.00, category: 'tax' },
    { account: '8320', name: 'Endring i utsatt skatt/skattefordel', value2025: 0.00, value2024: -1276.00, category: 'tax' },
  ]

  // Calculate totals
  const revenue2025 = incomeStatementData.filter(item => item.category === 'revenue').reduce((sum, item) => sum + item.value2025, 0)
  const revenue2024 = incomeStatementData.filter(item => item.category === 'revenue').reduce((sum, item) => sum + item.value2024, 0)

  const salaryExpenses2025 = incomeStatementData.filter(item => item.category === 'salary').reduce((sum, item) => sum + item.value2025, 0)
  const salaryExpenses2024 = incomeStatementData.filter(item => item.category === 'salary').reduce((sum, item) => sum + item.value2024, 0)

  const depreciation2025 = incomeStatementData.filter(item => item.category === 'depreciation').reduce((sum, item) => sum + item.value2025, 0)
  const depreciation2024 = incomeStatementData.filter(item => item.category === 'depreciation').reduce((sum, item) => sum + item.value2024, 0)

  const operatingExpenses2025 = incomeStatementData.filter(item => item.category === 'operating').reduce((sum, item) => sum + item.value2025, 0)
  const operatingExpenses2024 = incomeStatementData.filter(item => item.category === 'operating').reduce((sum, item) => sum + item.value2024, 0)

  const totalExpenses2025 = salaryExpenses2025 + depreciation2025 + operatingExpenses2025
  const totalExpenses2024 = salaryExpenses2024 + depreciation2024 + operatingExpenses2024

  const operatingResult2025 = revenue2025 - totalExpenses2025
  const operatingResult2024 = revenue2024 - totalExpenses2024

  const financialIncome2025 = incomeStatementData.filter(item => item.category === 'financial_income').reduce((sum, item) => sum + item.value2025, 0)
  const financialIncome2024 = incomeStatementData.filter(item => item.category === 'financial_income').reduce((sum, item) => sum + item.value2024, 0)

  const financialExpenses2025 = incomeStatementData.filter(item => item.category === 'financial_expense').reduce((sum, item) => sum + item.value2025, 0)
  const financialExpenses2024 = incomeStatementData.filter(item => item.category === 'financial_expense').reduce((sum, item) => sum + item.value2024, 0)

  const netFinancial2025 = financialIncome2025 - financialExpenses2025
  const netFinancial2024 = financialIncome2024 - financialExpenses2024

  const resultBeforeTax2025 = operatingResult2025 + netFinancial2025
  const resultBeforeTax2024 = operatingResult2024 + netFinancial2024

  const tax2025 = incomeStatementData.filter(item => item.category === 'tax').reduce((sum, item) => sum + item.value2025, 0)
  const tax2024 = incomeStatementData.filter(item => item.category === 'tax').reduce((sum, item) => sum + item.value2024, 0)

  const netResult2025 = resultBeforeTax2025 - tax2025
  const netResult2024 = resultBeforeTax2024 - tax2024

  // Financial data with calculated percentages
  const financialData = {
    revenue: revenue2025,
    revenue2024: revenue2024,
    salaryExpenses: salaryExpenses2025,
    salaryExpenses2024: salaryExpenses2024,
    operatingExpenses: operatingExpenses2025,
    operatingExpenses2024: operatingExpenses2024,
    totalExpenses: totalExpenses2025,
    totalExpenses2024: totalExpenses2024,
    operatingResult: operatingResult2025,
    operatingResult2024: operatingResult2024,
    financeCosts: financialExpenses2025,
    financeCosts2024: financialExpenses2024,
    resultBeforeTax: resultBeforeTax2025,
    resultBeforeTax2024: resultBeforeTax2024,
  }

  // Helper function to calculate percentage change
  const calculatePercentChange = (current, previous) => {
    if (previous === 0) return current === 0 ? 0 : 100
    return ((current - previous) / previous) * 100
  }

  // Helper function to format percentage
  const formatPercent = (current, previous) => {
    const change = calculatePercentChange(current, previous)
    const formatted = Math.abs(change).toFixed(1)
    return change >= 0 ? `+${formatted}%` : `-${formatted}%`
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
    }).format(amount)

  const formatShort = (amount) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}k`
    return amount.toFixed(0)
  }

  // Income vs Expenses chart data
  const incomeExpensesData = [
    {
      name: '2025',
      income: financialData.revenue,
      expenses:
        financialData.salaryExpenses +
        financialData.operatingExpenses,
    },
    {
      name: '2024',
      income: financialData.revenue2024,
      expenses:
        financialData.salaryExpenses2024 +
        financialData.operatingExpenses2024,
    },
  ]

  // Expense breakdown for 2025
  const expenseBreakdown = [
    {
      name: 'Lønnskostnader',
      value: financialData.salaryExpenses,
      percent:
        (
          (financialData.salaryExpenses /
            (financialData.salaryExpenses +
              financialData.operatingExpenses)) *
          100
        ).toFixed(1),
    },
    {
      name: 'Driftskostnader',
      value: financialData.operatingExpenses,
      percent:
        (
          (financialData.operatingExpenses /
            (financialData.salaryExpenses +
              financialData.operatingExpenses)) *
          100
        ).toFixed(1),
    },
  ]

  const chartConfig = {
    contentStyle: {
      backgroundColor: darkMode ? '#111827' : '#ffffff',
      border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
      borderRadius: '8px',
    },
    labelStyle: {
      color: darkMode ? '#d1d5db' : '#6b7280',
    },
  }

  // Income vs Expenses Chart
  const incomeExpensesChart = {
    chart: {
      type: 'column',
      backgroundColor: darkMode ? '#1f2937' : 'transparent',
      borderRadius: 8,
    },
    title: null,
    xAxis: {
      categories: ['2025', '2024'],
      labels: {
        style: {
          color: darkMode ? '#d1d5db' : '#6b7280',
          fontSize: '14px',
        },
      },
    },
    yAxis: {
      title: null,
      labels: {
        style: {
          color: darkMode ? '#d1d5db' : '#6b7280',
          fontSize: '12px',
        },
      },
      gridLineColor: darkMode ? '#374151' : '#e5e7eb',
    },
    legend: {
      itemStyle: {
        color: darkMode ? '#d1d5db' : '#6b7280',
      },
    },
    tooltip: {
      backgroundColor: chartConfig.contentStyle.backgroundColor,
      borderColor: chartConfig.contentStyle.border,
      formatter: function () {
        return `<b>${this.series.name}</b><br/>${formatShort(this.y)} NOK`
      },
      style: {
        color: darkMode ? '#d1d5db' : '#6b7280',
      },
    },
    plotOptions: {
      column: {
        borderRadius: 4,
      },
    },
    series: [
      {
        name: 'Inntekter',
        data: incomeExpensesData.map((d) => d.income),
        color: '#10b981',
      },
      {
        name: 'Utgifter',
        data: incomeExpensesData.map((d) => d.expenses),
        color: '#ef4444',
      },
    ],
    credits: {
      enabled: false,
    },
  }

  // Expense breakdown pie chart
  const expensePieChart = {
    chart: {
      type: 'pie',
      backgroundColor: darkMode ? '#1f2937' : 'transparent',
      borderRadius: 8,
    },
    title: null,
    tooltip: {
      backgroundColor: chartConfig.contentStyle.backgroundColor,
      borderColor: chartConfig.contentStyle.border,
      formatter: function () {
        return `<b>${this.point.name}</b><br/>${formatCurrency(this.y)}<br/>(${this.point.percent}%)`
      },
      style: {
        color: darkMode ? '#d1d5db' : '#6b7280',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b><br/>{point.percent:.1f}%',
          style: {
            color: darkMode ? '#f3f4f6' : '#1f2937',
            fontSize: '12px',
          },
        },
      },
    },
    series: [
      {
        name: 'Utgifter',
        colorByPoint: true,
        data: expenseBreakdown.map((item) => ({
          name: item.name,
          y: item.value,
          percent: item.percent,
        })),
        colors: ['#3b82f6', '#f59e0b'],
      },
    ],
    credits: {
      enabled: false,
    },
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div>
        <h2
          className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}
        >
          FWH Bemanning - Finansielt Overblikk
        </h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          2025 sammenlignet med 2024
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div
          className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Inntekter 2025
              </p>
              <p
                className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {formatShort(financialData.revenue)}
              </p>
            </div>
            <DollarSign
              className={`w-10 h-10 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
            />
          </div>
          <p className={`text-xs mt-2 ${calculatePercentChange(financialData.revenue, financialData.revenue2024) >= 0 ? darkMode ? 'text-emerald-400' : 'text-emerald-600' : darkMode ? 'text-red-400' : 'text-red-600'}`}>
            {formatPercent(financialData.revenue, financialData.revenue2024)} vs 2024
          </p>
        </div>

        {/* Operating Result */}
        <div
          className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Driftsresultat 2025
              </p>
              <p
                className={`text-2xl sm:text-3xl font-bold ${financialData.operatingResult < 0 ? darkMode ? 'text-red-400' : 'text-red-600' : darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
              >
                {formatShort(financialData.operatingResult)}
              </p>
            </div>
            {financialData.operatingResult >= 0 ? (
              <TrendingUp
                className={`w-10 h-10 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
              />
            ) : (
              <TrendingDown
                className={`w-10 h-10 ${darkMode ? 'text-red-400' : 'text-red-600'}`}
              />
            )}
          </div>
          <p className={`text-xs mt-2 ${calculatePercentChange(financialData.operatingResult, financialData.operatingResult2024) >= 0 ? darkMode ? 'text-emerald-400' : 'text-emerald-600' : darkMode ? 'text-red-400' : 'text-red-600'}`}>
            {formatPercent(financialData.operatingResult, financialData.operatingResult2024)} vs 2024
          </p>
        </div>

        {/* Total Expenses */}
        <div
          className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Total utgifter 2025
              </p>
              <p
                className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {formatShort(financialData.totalExpenses)}
              </p>
            </div>
            <AlertCircle
              className={`w-10 h-10 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}
            />
          </div>
          <p className={`text-xs mt-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
            {formatPercent(financialData.totalExpenses, financialData.totalExpenses2024)} vs 2024
          </p>
        </div>

        {/* Salary Expenses */}
        <div
          className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Lønnskostnader 2025
              </p>
              <p
                className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {formatShort(financialData.salaryExpenses)}
              </p>
            </div>
            <TrendingUp
              className={`w-10 h-10 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
            />
          </div>
          <p className={`text-xs mt-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
            {formatPercent(financialData.salaryExpenses, financialData.salaryExpenses2024)} vs 2024
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses */}
        <div
          className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3
            className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Inntekter vs Utgifter
          </h3>
          <HighchartsReact highcharts={Highcharts} options={incomeExpensesChart} />
        </div>

        {/* Expense Breakdown */}
        <div
          className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3
            className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Utgiftsfordeling 2025
          </h3>
          <HighchartsReact highcharts={Highcharts} options={expensePieChart} />
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3
          className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
        >
          Detaljert sammenligning
        </h3>
        <div className="overflow-x-auto">
          <table
            className={`w-full text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            <thead>
              <tr
                className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <th className="text-left py-3 px-4 font-semibold">
                  Linjeelement
                </th>
                <th className="text-right py-3 px-4 font-semibold">2025</th>
                <th className="text-right py-3 px-4 font-semibold">2024</th>
                <th className="text-right py-3 px-4 font-semibold">Endring %</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <td className="py-3 px-4 font-semibold text-emerald-500">
                  Salgsinntekt
                </td>
                <td className="text-right py-3 px-4">
                  {formatCurrency(financialData.revenue)}
                </td>
                <td className="text-right py-3 px-4">
                  {formatCurrency(financialData.revenue2024)}
                </td>
                <td className={`text-right py-3 px-4 ${calculatePercentChange(financialData.revenue, financialData.revenue2024) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {formatPercent(financialData.revenue, financialData.revenue2024)}
                </td>
              </tr>
              <tr
                className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <td className="py-3 px-4">Lønnskostnad</td>
                <td className="text-right py-3 px-4">
                  {formatCurrency(financialData.salaryExpenses)}
                </td>
                <td className="text-right py-3 px-4">
                  {formatCurrency(financialData.salaryExpenses2024)}
                </td>
                <td className="text-right py-3 px-4 text-orange-500">
                  {formatPercent(financialData.salaryExpenses, financialData.salaryExpenses2024)}
                </td>
              </tr>
              <tr
                className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <td className="py-3 px-4">Annen driftskostnad</td>
                <td className="text-right py-3 px-4">
                  {formatCurrency(financialData.operatingExpenses)}
                </td>
                <td className="text-right py-3 px-4">
                  {formatCurrency(financialData.operatingExpenses2024)}
                </td>
                <td className="text-right py-3 px-4 text-orange-500">
                  {formatPercent(financialData.operatingExpenses, financialData.operatingExpenses2024)}
                </td>
              </tr>
              <tr
                className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
              >
                <td className="py-3 px-4 font-semibold text-emerald-500">
                  Driftsresultat
                </td>
                <td className={`text-right py-3 px-4 font-semibold ${financialData.operatingResult >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {formatCurrency(financialData.operatingResult)}
                </td>
                <td className="text-right py-3 px-4 font-semibold text-emerald-500">
                  {formatCurrency(financialData.operatingResult2024)}
                </td>
                <td className={`text-right py-3 px-4 font-semibold ${calculatePercentChange(financialData.operatingResult, financialData.operatingResult2024) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {formatPercent(financialData.operatingResult, financialData.operatingResult2024)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Income Statement */}
      <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3
          className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
        >
          Fullstendig Resultatregnskap
        </h3>
        <div className="overflow-x-auto">
          <table
            className={`w-full text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            <thead>
              <tr
                className={`border-b-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <th className="text-left py-3 px-4 font-bold">Konto</th>
                <th className="text-right py-3 px-4 font-bold">2025</th>
                <th className="text-right py-3 px-4 font-bold">2024</th>
                <th className="text-right py-3 px-4 font-bold">Endring</th>
              </tr>
            </thead>
            <tbody>
              {/* Revenue Section */}
              <tr className={`${darkMode ? 'bg-gray-700 bg-opacity-50' : 'bg-blue-50'}`}>
                <td className="py-3 px-4 font-bold text-emerald-500">INNTEKTER</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              {incomeStatementData.filter(item => item.category === 'revenue').map((item, index) => (
                <tr key={index} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <td className="py-3 px-4">{item.account ? `${item.account} - ` : ''}{item.name}</td>
                  <td className="text-right py-3 px-4">{formatCurrency(item.value2025)}</td>
                  <td className="text-right py-3 px-4">{formatCurrency(item.value2024)}</td>
                  <td className={`text-right py-3 px-4 ${calculatePercentChange(item.value2025, item.value2024) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {formatPercent(item.value2025, item.value2024)}
                  </td>
                </tr>
              ))}
              <tr className={`border-b-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'} font-semibold`}>
                <td className="py-3 px-4">Sum inntekter</td>
                <td className="text-right py-3 px-4">{formatCurrency(revenue2025)}</td>
                <td className="text-right py-3 px-4">{formatCurrency(revenue2024)}</td>
                <td className={`text-right py-3 px-4 ${calculatePercentChange(revenue2025, revenue2024) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {formatPercent(revenue2025, revenue2024)}
                </td>
              </tr>

              {/* Salary Costs Section */}
              <tr className={`${darkMode ? 'bg-gray-700 bg-opacity-50' : 'bg-red-50'}`}>
                <td className="py-3 px-4 font-bold text-red-500">LØNNSKOSTNADER</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              {incomeStatementData.filter(item => item.category === 'salary').map((item, index) => (
                <tr key={index} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <td className="py-3 px-4">{item.account ? `${item.account} - ` : ''}{item.name}</td>
                  <td className="text-right py-3 px-4">{formatCurrency(item.value2025)}</td>
                  <td className="text-right py-3 px-4">{formatCurrency(item.value2024)}</td>
                  <td className={`text-right py-3 px-4 ${calculatePercentChange(item.value2025, item.value2024) >= 0 ? 'text-orange-500' : 'text-emerald-500'}`}>
                    {formatPercent(item.value2025, item.value2024)}
                  </td>
                </tr>
              ))}
              <tr className={`border-b-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'} font-semibold`}>
                <td className="py-3 px-4">Sum lønnskostnader</td>
                <td className="text-right py-3 px-4">{formatCurrency(salaryExpenses2025)}</td>
                <td className="text-right py-3 px-4">{formatCurrency(salaryExpenses2024)}</td>
                <td className="text-right py-3 px-4 text-orange-500">
                  {formatPercent(salaryExpenses2025, salaryExpenses2024)}
                </td>
              </tr>

              {/* Depreciation Section */}
              {depreciation2025 > 0 || depreciation2024 > 0 ? (
                <>
                  <tr className={`${darkMode ? 'bg-gray-700 bg-opacity-50' : 'bg-red-50'}`}>
                    <td className="py-3 px-4 font-bold text-red-500">AVSKRIVNINGER</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  {incomeStatementData.filter(item => item.category === 'depreciation').map((item, index) => (
                    <tr key={index} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="py-3 px-4">{item.account ? `${item.account} - ` : ''}{item.name}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(item.value2025)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(item.value2024)}</td>
                      <td className={`text-right py-3 px-4 ${calculatePercentChange(item.value2025, item.value2024) >= 0 ? 'text-orange-500' : 'text-emerald-500'}`}>
                        {formatPercent(item.value2025, item.value2024)}
                      </td>
                    </tr>
                  ))}
                  <tr className={`border-b-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'} font-semibold`}>
                    <td className="py-3 px-4">Sum avskrivninger</td>
                    <td className="text-right py-3 px-4">{formatCurrency(depreciation2025)}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(depreciation2024)}</td>
                    <td className="text-right py-3 px-4 text-orange-500">
                      {formatPercent(depreciation2025, depreciation2024)}
                    </td>
                  </tr>
                </>
              ) : null}

              {/* Operating Expenses Section */}
              <tr className={`${darkMode ? 'bg-gray-700 bg-opacity-50' : 'bg-red-50'}`}>
                <td className="py-3 px-4 font-bold text-red-500">DRIFTSKOSTNADER</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              {incomeStatementData.filter(item => item.category === 'operating').map((item, index) => (
                <tr key={index} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-sm`}>
                  <td className="py-2 px-4">{item.account ? `${item.account} - ` : ''}{item.name}</td>
                  <td className="text-right py-2 px-4">{formatCurrency(item.value2025)}</td>
                  <td className="text-right py-2 px-4">{formatCurrency(item.value2024)}</td>
                  <td className={`text-right py-2 px-4 ${calculatePercentChange(item.value2025, item.value2024) >= 0 ? 'text-orange-500' : 'text-emerald-500'}`}>
                    {formatPercent(item.value2025, item.value2024)}
                  </td>
                </tr>
              ))}
              <tr className={`border-b-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'} font-semibold`}>
                <td className="py-3 px-4">Sum driftskostnader</td>
                <td className="text-right py-3 px-4">{formatCurrency(operatingExpenses2025)}</td>
                <td className="text-right py-3 px-4">{formatCurrency(operatingExpenses2024)}</td>
                <td className="text-right py-3 px-4 text-orange-500">
                  {formatPercent(operatingExpenses2025, operatingExpenses2024)}
                </td>
              </tr>

              {/* Operating Result */}
              <tr
                className={`${darkMode ? 'bg-gray-700 bg-opacity-50' : 'bg-indigo-50'} border-t-2 ${darkMode ? 'border-t-gray-600' : 'border-t-gray-300'}`}
              >
                <td className="py-3 px-4 font-bold text-indigo-600">DRIFTSRESULTAT</td>
                <td className={`text-right py-3 px-4 font-bold ${operatingResult2025 >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(operatingResult2025)}
                </td>
                <td className="text-right py-3 px-4 font-bold text-emerald-600">
                  {formatCurrency(operatingResult2024)}
                </td>
                <td className={`text-right py-3 px-4 font-bold ${calculatePercentChange(operatingResult2025, operatingResult2024) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {formatPercent(operatingResult2025, operatingResult2024)}
                </td>
              </tr>

              {/* Financial Income */}
              {financialIncome2025 > 0 || financialIncome2024 > 0 ? (
                <>
                  <tr className={`${darkMode ? 'bg-gray-700 bg-opacity-50' : 'bg-gray-50'}`}>
                    <td className="py-3 px-4 font-bold text-gray-600 dark:text-gray-300">FINANSINNTEKTER</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  {incomeStatementData.filter(item => item.category === 'financial_income').map((item, index) => (
                    <tr key={index} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="py-3 px-4">{item.account ? `${item.account} - ` : ''}{item.name}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(item.value2025)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(item.value2024)}</td>
                      <td className={`text-right py-3 px-4 ${calculatePercentChange(item.value2025, item.value2024) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {formatPercent(item.value2025, item.value2024)}
                      </td>
                    </tr>
                  ))}
                </>
              ) : null}

              {/* Financial Expenses */}
              <tr className={`${darkMode ? 'bg-gray-700 bg-opacity-50' : 'bg-gray-50'}`}>
                <td className="py-3 px-4 font-bold text-gray-600 dark:text-gray-300">FINANSKOSTNADER</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              {incomeStatementData.filter(item => item.category === 'financial_expense').map((item, index) => (
                <tr key={index} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <td className="py-3 px-4">{item.account ? `${item.account} - ` : ''}{item.name}</td>
                  <td className="text-right py-3 px-4">{formatCurrency(item.value2025)}</td>
                  <td className="text-right py-3 px-4">{formatCurrency(item.value2024)}</td>
                  <td className={`text-right py-3 px-4 ${calculatePercentChange(item.value2025, item.value2024) >= 0 ? 'text-orange-500' : 'text-emerald-500'}`}>
                    {formatPercent(item.value2025, item.value2024)}
                  </td>
                </tr>
              ))}
              <tr className={`border-b-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'} font-semibold`}>
                <td className="py-3 px-4">Netto finansposter</td>
                <td className={`text-right py-3 px-4 ${netFinancial2025 >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(netFinancial2025)}
                </td>
                <td className="text-right py-3 px-4">{formatCurrency(netFinancial2024)}</td>
                <td className={`text-right py-3 px-4 ${calculatePercentChange(netFinancial2025, netFinancial2024) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {formatPercent(netFinancial2025, netFinancial2024)}
                </td>
              </tr>

              {/* Result Before Tax */}
              <tr
                className={`${darkMode ? 'bg-gray-700' : 'bg-emerald-50'} border-t-2 ${darkMode ? 'border-t-gray-600' : 'border-t-gray-300'}`}
              >
                <td className="py-4 px-4 font-bold text-lg text-emerald-600">RESULTAT FØR SKATT</td>
                <td className={`text-right py-4 px-4 font-bold text-lg ${resultBeforeTax2025 >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(resultBeforeTax2025)}
                </td>
                <td className="text-right py-4 px-4 font-bold text-lg text-emerald-600">
                  {formatCurrency(resultBeforeTax2024)}
                </td>
                <td className={`text-right py-4 px-4 font-bold text-lg ${calculatePercentChange(resultBeforeTax2025, resultBeforeTax2024) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {formatPercent(resultBeforeTax2025, resultBeforeTax2024)}
                </td>
              </tr>

              {/* Tax */}
              {tax2025 > 0 || tax2024 > 0 ? (
                <>
                  <tr className={`${darkMode ? 'bg-gray-700 bg-opacity-50' : 'bg-gray-50'}`}>
                    <td className="py-3 px-4 font-bold text-gray-600 dark:text-gray-300">SKATT</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  {incomeStatementData.filter(item => item.category === 'tax').map((item, index) => (
                    <tr key={index} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="py-3 px-4">{item.account ? `${item.account} - ` : ''}{item.name}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(item.value2025)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(item.value2024)}</td>
                      <td className={`text-right py-3 px-4 ${calculatePercentChange(item.value2025, item.value2024) >= 0 ? 'text-orange-500' : 'text-emerald-500'}`}>
                        {formatPercent(item.value2025, item.value2024)}
                      </td>
                    </tr>
                  ))}
                  <tr className={`border-b-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'} font-semibold`}>
                    <td className="py-3 px-4">Sum skatt</td>
                    <td className="text-right py-3 px-4">{formatCurrency(tax2025)}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(tax2024)}</td>
                    <td className="text-right py-3 px-4 text-orange-500">
                      {formatPercent(tax2025, tax2024)}
                    </td>
                  </tr>

                  {/* Net Result */}
                  <tr
                    className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border-t-2 ${darkMode ? 'border-t-gray-600' : 'border-t-gray-300'}`}
                  >
                    <td className="py-4 px-4 font-bold text-lg text-blue-600">ÅRSRESULTAT</td>
                    <td className={`text-right py-4 px-4 font-bold text-lg ${netResult2025 >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(netResult2025)}
                    </td>
                    <td className="text-right py-4 px-4 font-bold text-lg text-emerald-600">
                      {formatCurrency(netResult2024)}
                    </td>
                    <td className={`text-right py-4 px-4 font-bold text-lg ${calculatePercentChange(netResult2025, netResult2024) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {formatPercent(netResult2025, netResult2024)}
                    </td>
                  </tr>
                </>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
