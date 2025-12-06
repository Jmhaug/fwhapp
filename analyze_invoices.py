#!/usr/bin/env python3
"""
FWH Invoice Analysis Script
Analyzes all CSV files to find recurring invoices by vendor, frequency, and amount patterns.
Updated to handle company-separated files.
"""

import pandas as pd
import json
from pathlib import Path
from datetime import datetime
from collections import defaultdict
import numpy as np

# CSV files organized by company
CSV_FILES = {
    'eiendom': 'Leverandørfakturaer - Periode 1. jan - 6. des 2025 fwh eiendom.csv',
    'invest': 'Leverandørfakturaer - 2025 invest.csv',
    'bemanning': 'Leverandørfakturaer - 2025-2 FWH Bemanning.csv',
}

def load_and_parse_csv(filename, company):
    """Load CSV file and parse dates"""
    try:
        df = pd.read_csv(filename, sep=';', encoding='utf-8-sig')
        print(f"✓ Loaded {company.upper()}: {filename} ({len(df)} rows)")

        # Clean up column names (remove leading/trailing spaces)
        df.columns = df.columns.str.strip()

        # Parse dates
        df['Fakturadato'] = pd.to_datetime(df['Fakturadato'], format='%d.%m.%Y', errors='coerce')

        # Convert amount to numeric - handle Norwegian format (. as thousands, , as decimal)
        def parse_norwegian_number(x):
            if pd.isna(x):
                return np.nan
            x = str(x).strip()
            if not x or x == '':
                return np.nan
            # Remove quotes if present
            x = x.replace('"', '')
            # Norwegian format: use . as thousands separator and , as decimal
            x = x.replace('.', '').replace(',', '.')
            try:
                return float(x)
            except:
                return np.nan

        df['Totalbeløp'] = df['Totalbeløp'].apply(parse_norwegian_number)

        # Remove sum rows and NaN dates
        df = df[df['Fakturadato'].notna() & (df['Leverandør'] != 'Sum')]

        # Add company column
        df['Company'] = company

        return df
    except Exception as e:
        print(f"✗ Error loading {filename}: {e}")
        return None

def analyze_vendor_patterns(df):
    """Analyze invoice patterns by vendor and company"""
    print("\n" + "="*80)
    print("ANALYZING VENDOR PATTERNS")
    print("="*80)

    vendor_data = defaultdict(lambda: defaultdict(lambda: {
        'invoices': [],
        'total_amount': 0,
        'count': 0,
        'dates': [],
        'amounts': []
    }))

    for _, row in df.iterrows():
        vendor = row['Leverandør'].strip()
        company = row['Company']
        amount = row['Totalbeløp']
        date = row['Fakturadato']

        if pd.notna(amount):
            vendor_data[company][vendor]['invoices'].append({
                'date': date,
                'amount': amount,
            })
            vendor_data[company][vendor]['total_amount'] += amount
            vendor_data[company][vendor]['count'] += 1
            vendor_data[company][vendor]['dates'].append(date)
            vendor_data[company][vendor]['amounts'].append(amount)

    return vendor_data

def calculate_frequency(dates):
    """Calculate invoice frequency pattern"""
    if len(dates) < 2:
        return "single", None, None

    dates = sorted(dates)
    differences = []
    for i in range(1, len(dates)):
        diff = (dates[i] - dates[i-1]).days
        differences.append(diff)

    avg_diff = np.mean(differences)
    std_diff = np.std(differences)

    # Classify frequency
    if avg_diff < 10:
        return "weekly", round(avg_diff, 1), round(std_diff, 1)
    elif avg_diff < 40:
        return "monthly", round(avg_diff, 1), round(std_diff, 1)
    elif avg_diff < 100:
        return "bi-monthly", round(avg_diff, 1), round(std_diff, 1)
    elif avg_diff < 150:
        return "quarterly", round(avg_diff, 1), round(std_diff, 1)
    elif avg_diff < 200:
        return "4-monthly", round(avg_diff, 1), round(std_diff, 1)
    else:
        return "annual", round(avg_diff, 1), round(std_diff, 1)

def is_recurring(vendor_info):
    """Determine if a vendor is recurring"""
    count = vendor_info['count']
    frequency, avg_diff, std_diff = calculate_frequency(vendor_info['dates'])

    # Recurring if at least 3 invoices with regular pattern
    is_regular = count >= 3 and frequency != 'single'

    return is_regular, frequency

def format_currency(amount):
    """Format amount as Norwegian currency"""
    return f"{amount:,.2f}".replace(',', ' ').replace('.', ',')

def analyze_by_division(vendor_data):
    """Group vendors by division"""
    print("\n" + "="*80)
    print("INVOICE SUMMARY BY DIVISION")
    print("="*80)

    divisions = defaultdict(list)

    for company in ['eiendom', 'invest', 'bemanning']:
        company_vendors = vendor_data.get(company, {})

        for vendor, info in sorted(company_vendors.items()):
            is_rec, freq = is_recurring(info)

            if is_rec:
                avg_amount = info['total_amount'] / info['count']

                divisions[company].append({
                    'vendor': vendor,
                    'count': info['count'],
                    'total': info['total_amount'],
                    'average': avg_amount,
                    'frequency': freq,
                    'dates': [d.strftime('%Y-%m-%d') for d in sorted(info['dates'])],
                    'amounts': info['amounts']
                })

    # Print summary
    for company, display_name in [('eiendom', 'EIENDOM'), ('invest', 'INVEST'), ('bemanning', 'BEMANNING')]:
        vendors = divisions.get(company, [])
        print(f"\n{'='*80}")
        print(f"📍 FWH {display_name}")
        print(f"{'='*80}")

        if not vendors:
            print("No recurring invoices found.")
            continue

        print(f"Found {len(vendors)} recurring vendor(s):\n")

        total_monthly = 0
        for vendor_info in sorted(vendors, key=lambda x: x['average'], reverse=True):
            vendor = vendor_info['vendor']
            count = vendor_info['count']
            total = vendor_info['total']
            avg = vendor_info['average']
            freq = vendor_info['frequency']

            print(f"  {vendor}")
            print(f"    • Frequency: {freq}")
            print(f"    • Count: {count} invoices")
            print(f"    • Average: {format_currency(avg)} NOK")
            print(f"    • Total: {format_currency(total)} NOK")
            print(f"    • Last invoice: {vendor_info['dates'][-1]}")

            # Estimate monthly cost
            if freq == 'monthly':
                total_monthly += avg
            elif freq == 'quarterly':
                total_monthly += avg / 3
            elif freq == 'annual':
                total_monthly += avg / 12
            elif freq == 'bi-monthly':
                total_monthly += avg / 2

            print()

        print(f"  ESTIMATED MONTHLY COST: {format_currency(total_monthly)} NOK")

    return divisions

def export_to_json(divisions):
    """Export recurring invoices to JSON format for React app"""
    print("\n" + "="*80)
    print("EXPORTING TO JSON")
    print("="*80)

    output = {
        'eiendom': [],
        'invest': [],
        'bemanning': [],
        'analysis_date': datetime.now().isoformat(),
    }

    id_counter = 1

    for company in ['eiendom', 'invest', 'bemanning']:
        vendors = divisions.get(company, [])

        for vendor_info in sorted(vendors, key=lambda x: x['average'], reverse=True):
            freq = vendor_info['frequency']

            # Map to frequency format for app
            if freq == 'monthly':
                frequency = 'Monthly'
            elif freq == 'quarterly':
                frequency = 'Quarterly'
            elif freq in ['annual', '4-monthly']:
                frequency = 'Annual'
            elif freq == 'bi-monthly':
                frequency = 'Bi-Monthly'
            else:
                frequency = 'Other'

            output[company].append({
                'id': id_counter,
                'name': vendor_info['vendor'],
                'amount': round(vendor_info['average'], 2),
                'frequency': frequency,
                'invoice_count': vendor_info['count'],
                'total_paid': round(vendor_info['total'], 2),
                'last_invoice': vendor_info['dates'][-1] if vendor_info['dates'] else None,
            })
            id_counter += 1

    # Write to file
    with open('recurring_invoices.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print("✓ Exported to recurring_invoices.json")

    return output

def print_statistics(df):
    """Print overall statistics"""
    print("\n" + "="*80)
    print("OVERALL STATISTICS")
    print("="*80)

    print(f"\nTotal invoices analyzed: {len(df)}")
    print(f"Date range: {df['Fakturadato'].min().strftime('%d.%m.%Y')} to {df['Fakturadato'].max().strftime('%d.%m.%Y')}")
    print(f"Total amount: {format_currency(df['Totalbeløp'].sum())} NOK")
    print(f"Average invoice: {format_currency(df['Totalbeløp'].mean())} NOK")
    print(f"Unique vendors: {df['Leverandør'].nunique()}")

    print(f"\nTop 10 vendors by total amount:")
    top_vendors = df.groupby('Leverandør')['Totalbeløp'].agg(['sum', 'count']).sort_values('sum', ascending=False).head(10)
    for vendor, (total, count) in top_vendors.iterrows():
        print(f"  {vendor}: {format_currency(total)} NOK ({int(count)} invoices)")

    print(f"\nBreakdown by company:")
    for company in ['eiendom', 'invest', 'bemanning']:
        company_df = df[df['Company'] == company]
        print(f"  FWH {company.upper()}: {len(company_df)} invoices, {format_currency(company_df['Totalbeløp'].sum())} NOK")

def main():
    """Main analysis function"""
    print("\n" + "="*80)
    print("FWH INVOICE ANALYSIS - FULL REPORT")
    print("="*80)

    # Load all CSV files
    all_data = []
    for company, csv_file in CSV_FILES.items():
        if Path(csv_file).exists():
            df = load_and_parse_csv(csv_file, company)
            if df is not None:
                all_data.append(df)
        else:
            print(f"✗ File not found: {csv_file}")

    if not all_data:
        print("✗ No CSV files found!")
        return

    # Combine all data
    df_combined = pd.concat(all_data, ignore_index=True)
    df_combined = df_combined.drop_duplicates(subset=['Fakturanr.'], keep='first')

    print(f"\n✓ Total unique invoices: {len(df_combined)}")

    # Print overall stats
    print_statistics(df_combined)

    # Analyze patterns
    vendor_data = analyze_vendor_patterns(df_combined)

    # Group by division
    divisions = analyze_by_division(vendor_data)

    # Export to JSON
    json_output = export_to_json(divisions)

    print("\n" + "="*80)
    print("ANALYSIS COMPLETE ✓")
    print("="*80)
    print("\nTo update your React app, copy the 'recurring_invoices.json' contents")
    print("into the RECURRING_INVOICES object in src/App.jsx")

if __name__ == '__main__':
    main()
