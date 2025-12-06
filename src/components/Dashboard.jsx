import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { TrendingUp, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react'

export default function Dashboard({ data, currentCompany, companies, recurringInvoices, darkMode }) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
    }).format(amount)

  // Calculate stats
  const allInvoices = [data.eiendom.invoices, data.invest.invoices, data.bemanning.invoices].flat()
  const allTasks = [data.eiendom.tasks, data.invest.tasks, data.bemanning.tasks].flat()
  const totalInvoiceAmount = allInvoices.reduce((sum, inv) => sum + inv.amount, 0)
  const taskCompletionRate = allTasks.length > 0 ? (allTasks.filter(t => t.completed).length / allTasks.length) * 100 : 0

  // Chart data - Invoices by company
  const invoicesByCompany = [
    {
      name: companies.eiendom,
      amount: data.eiendom.invoices.reduce((sum, inv) => sum + inv.amount, 0),
    },
    {
      name: companies.invest,
      amount: data.invest.invoices.reduce((sum, inv) => sum + inv.amount, 0),
    },
    {
      name: companies.bemanning,
      amount: data.bemanning.invoices.reduce((sum, inv) => sum + inv.amount, 0),
    },
  ]

  // Chart data - Stacked recurring invoices by company
  const stackedRecurringByCompany = [
    {
      name: companies.eiendom,
      ...recurringInvoices.eiendom.reduce((acc, inv) => {
        acc[inv.name] = inv.amount
        return acc
      }, {}),
    },
    {
      name: companies.invest,
      ...recurringInvoices.invest.reduce((acc, inv) => {
        acc[inv.name] = inv.amount
        return acc
      }, {}),
    },
    {
      name: companies.bemanning,
      ...recurringInvoices.bemanning.reduce((acc, inv) => {
        acc[inv.name] = inv.amount
        return acc
      }, {}),
    },
  ]

  // Get all unique vendor names for stacked chart
  const allVendors = [
    ...new Set([
      ...recurringInvoices.eiendom.map(inv => inv.name),
      ...recurringInvoices.invest.map(inv => inv.name),
      ...recurringInvoices.bemanning.map(inv => inv.name),
    ]),
  ]

  // Generate colors for each vendor
  const vendorColors = {
    'Skatteetaten - Skatteinnkreving': '#6366f1',
    'Fwh Eiendom AS': '#8b5cf6',
    'Accountor AS': '#ec4899',
    'Nordea Liv AS': '#f59e0b',
    'If Skadeforsikring NUF': '#10b981',
    'PowerOffice AS': '#06b6d4',
    'Talkmore AS': '#3b82f6',
    'BKK AS': '#84cc16',
    'Kraftriket AS': '#f97316',
    'Sameiet Fanatorget': '#6366f1',
    'Bergen kommune': '#8b5cf6',
  }

  // Chart data - Tasks by company
  const tasksByCompany = [
    {
      name: companies.eiendom,
      total: data.eiendom.tasks.length,
      completed: data.eiendom.tasks.filter(t => t.completed).length,
    },
    {
      name: companies.invest,
      total: data.invest.tasks.length,
      completed: data.invest.tasks.filter(t => t.completed).length,
    },
    {
      name: companies.bemanning,
      total: data.bemanning.tasks.length,
      completed: data.bemanning.tasks.filter(t => t.completed).length,
    },
  ]

  // Chart data - Monthly recurring
  const monthlyRecurring = [
    {
      name: companies.eiendom,
      amount: recurringInvoices.eiendom.filter(inv => inv.frequency === 'Monthly').reduce((sum, inv) => sum + inv.amount, 0),
    },
    {
      name: companies.invest,
      amount: recurringInvoices.invest.filter(inv => inv.frequency === 'Monthly').reduce((sum, inv) => sum + inv.amount, 0),
    },
    {
      name: companies.bemanning,
      amount: recurringInvoices.bemanning.filter(inv => inv.frequency === 'Monthly').reduce((sum, inv) => sum + inv.amount, 0),
    },
  ]

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899']

  const chartConfig = {
    contentStyle: {
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
      borderRadius: '8px',
    },
    labelStyle: {
      color: darkMode ? '#d1d5db' : '#6b7280',
    },
    textStyle: {
      color: darkMode ? '#d1d5db' : '#6b7280',
    },
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Totale fakturaer</p>
              <p className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(totalInvoiceAmount)}
              </p>
            </div>
            <DollarSign className={`w-10 h-10 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </div>
        </div>

        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Oppgaver fullført</p>
              <p className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {allTasks.filter(t => t.completed).length}/{allTasks.length}
              </p>
            </div>
            <CheckCircle2 className={`w-10 h-10 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
        </div>

        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fullføringsprosent</p>
              <p className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {Math.round(taskCompletionRate)}%
              </p>
            </div>
            <TrendingUp className={`w-10 h-10 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
        </div>

        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Antall fakturaer</p>
              <p className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {allInvoices.length}
              </p>
            </div>
            <AlertCircle className={`w-10 h-10 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stacked Invoices by Company - Highcharts */}
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Estimert kostnadsfordeling per divisjon
          </h3>
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                type: 'column',
                backgroundColor: darkMode ? '#1f2937' : 'transparent',
                borderRadius: 8,
              },
              title: null,
              xAxis: {
                categories: stackedRecurringByCompany.map(c => c.name),
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
                stackLabels: {
                  enabled: true,
                  format: '{total:,.0f}',
                  style: {
                    color: darkMode ? '#f3f4f6' : '#1f2937',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textOutline: 'none',
                  },
                },
              },
              legend: {
                enabled: false,
              },
              tooltip: {
                backgroundColor: darkMode ? '#111827' : '#ffffff',
                borderColor: darkMode ? '#374151' : '#e5e7eb',
                borderRadius: 8,
                headerFormat: '<b>{point.key}</b><br/>',
                pointFormat: '<span style="color:{series.color}">{series.name}:</span> {point.y:,.0f} NOK<br/>',
                style: {
                  color: darkMode ? '#d1d5db' : '#6b7280',
                },
              },
              plotOptions: {
                column: {
                  stacking: 'normal',
                  borderRadius: 4,
                  dataLabels: {
                    enabled: false,
                  },
                },
              },
              series: allVendors.map((vendor) => ({
                name: vendor,
                data: stackedRecurringByCompany.map(company => company[vendor] || 0),
                color: vendorColors[vendor] || '#6366f1',
              })),
              credits: {
                enabled: false,
              },
            }}
          />
        </div>

        {/* Tasks Completion */}
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Oppgaver per divisjon
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tasksByCompany}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="name" {...chartConfig.textStyle} />
              <YAxis {...chartConfig.textStyle} />
              <Tooltip contentStyle={chartConfig.contentStyle} labelStyle={chartConfig.labelStyle} />
              <Legend wrapperStyle={chartConfig.textStyle} />
              <Bar dataKey="completed" stackId="a" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="total" stackId="a" fill="#d1d5db" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Recurring */}
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Månedlige gjentakende fakturaer
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={monthlyRecurring}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {monthlyRecurring.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={chartConfig.contentStyle} formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Company Comparison */}
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Kostnadssammenlikning
          </h3>
          <div className="space-y-4">
            {invoicesByCompany.map((company, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {company.name}
                  </p>
                  <p className={`font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    {formatCurrency(company.amount)}
                  </p>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{
                      width: `${(company.amount / Math.max(...invoicesByCompany.map(c => c.amount))) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
