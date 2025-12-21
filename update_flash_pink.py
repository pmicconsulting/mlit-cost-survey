#!/usr/bin/env python3
import re

# Define replacements for each file
replacements = [
    # Q24FuelSurchargeIntroduction.tsx
    {
        "file": "src/components/survey/questions/Q24FuelSurchargeIntroduction.tsx",
        "changes": [
            {
                "old": 'className="w-20 px-2 py-1 border border-gray-300 rounded text-right flash-pink"',
                "new": "className={`w-20 px-2 py-1 border border-gray-300 rounded text-right ${data.percentage ? 'input-filled' : 'flash-pink'}`}"
            }
        ]
    },
    # Q26FuelProcurement.tsx
    {
        "file": "src/components/survey/questions/Q26FuelProcurement.tsx",
        "changes": [
            {
                "old": 'className="w-full px-3 py-2 border border-gray-300 rounded-lg flash-pink"',
                "new": "className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${data.other.description ? 'input-filled' : 'flash-pink'}`}"
            }
        ]
    },
    # Q29TransactionTiers.tsx
    {
        "file": "src/components/survey/questions/Q29TransactionTiers.tsx",
        "changes": [
            {
                "old": 'className="w-16 px-2 py-1 border border-gray-300 rounded text-right flash-pink"',
                "new": "className={`w-16 px-2 py-1 border border-gray-300 rounded text-right ${data[key].ratio ? 'input-filled' : 'flash-pink'}`}"
            }
        ]
    },
    # Q31CharterFeeLevel.tsx
    {
        "file": "src/components/survey/questions/Q31CharterFeeLevel.tsx",
        "changes": [
            {
                "old": 'className="w-24 px-2 py-1 border border-gray-300 rounded text-right flash-pink"',
                "new": "className={`w-24 px-2 py-1 border border-gray-300 rounded text-right ${data[key].value ? 'input-filled' : 'flash-pink'}`}"
            }
        ]
    },
    # Q32CancellationFees.tsx
    {
        "file": "src/components/survey/questions/Q32CancellationFees.tsx",
        "changes": [
            {
                "old": 'className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${row?.useFixedAmount ? "flash-pink" : "disabled:bg-gray-100 disabled:text-gray-400"}`}',
                "new": "className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${row?.useFixedAmount ? (row?.fixedAmount ? 'input-filled' : 'flash-pink') : \"disabled:bg-gray-100 disabled:text-gray-400\"}`}"
            },
            {
                "old": 'className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${row?.useFareRatio ? "flash-pink" : "disabled:bg-gray-100 disabled:text-gray-400"}`}',
                "new": "className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${row?.useFareRatio ? (row?.fareRatio ? 'input-filled' : 'flash-pink') : \"disabled:bg-gray-100 disabled:text-gray-400\"}`}"
            }
        ]
    },
    # Q34EmptyRunFees.tsx
    {
        "file": "src/components/survey/questions/Q34EmptyRunFees.tsx",
        "changes": [
            {
                "old": '                        className="w-24 px-2 py-1 border border-gray-300 rounded text-right flash-pink"',
                "new": "                        className={`w-24 px-2 py-1 border border-gray-300 rounded text-right ${data.calculationMethods.hourly.rate ? 'input-filled' : 'flash-pink'}`}"
            },
            {
                "old": 'className="mt-2 w-full px-3 py-2 border border-gray-300 rounded flash-pink"',
                "new": "className={`mt-2 w-full px-3 py-2 border border-gray-300 rounded ${data.other.description ? 'input-filled' : 'flash-pink'}`}"
            }
        ]
    },
    # Q35DiscountFees.tsx
    {
        "file": "src/components/survey/questions/Q35DiscountFees.tsx",
        "changes": [
            {
                "old": '                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm flash-pink"',
                "new": "                          className={`w-full px-2 py-1 border border-gray-300 rounded text-sm ${data.otherDescription ? 'input-filled' : 'flash-pink'}`}"
            },
            {
                "old": 'className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${itemData?.selected ? "flash-pink" : "disabled:bg-gray-100 disabled:text-gray-400"}`}',
                "new": "className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${itemData?.selected ? (itemData?.fixedAmount ? 'input-filled' : 'flash-pink') : \"disabled:bg-gray-100 disabled:text-gray-400\"}`}"
            }
        ]
    },
    # Q36SurchargeFees.tsx
    {
        "file": "src/components/survey/questions/Q36SurchargeFees.tsx",
        "changes": [
            {
                "old": '                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm flash-pink"',
                "new": "                          className={`w-full px-2 py-1 border border-gray-300 rounded text-sm ${data.otherDescription ? 'input-filled' : 'flash-pink'}`}"
            },
            {
                "old": 'className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${itemData?.selected ? "flash-pink" : "disabled:bg-gray-100 disabled:text-gray-400"}`}',
                "new": "className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${itemData?.selected ? (itemData?.fixedAmount ? 'input-filled' : 'flash-pink') : \"disabled:bg-gray-100 disabled:text-gray-400\"}`}"
            }
        ]
    },
    # Q37FareBasis.tsx
    {
        "file": "src/components/survey/questions/Q37FareBasis.tsx",
        "changes": [
            {
                "old": 'className="w-full px-3 py-2 border border-gray-300 rounded-lg flash-pink"',
                "new": "className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${data.other.description ? 'input-filled' : 'flash-pink'}`}"
            }
        ]
    }
]

# Process each file
for item in replacements:
    filepath = item["file"]
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        modified = False
        for change in item["changes"]:
            if change["old"] in content:
                content = content.replace(change["old"], change["new"])
                modified = True
                print(f"✓ Updated {filepath}: {change['old'][:50]}...")
            else:
                print(f"⚠ Pattern not found in {filepath}: {change['old'][:50]}...")

        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Saved {filepath}")
    except Exception as e:
        print(f"✗ Error processing {filepath}: {e}")

print("\n✓ Flash-pink updates completed!")
