#!/bin/bash

# Q24FuelSurchargeIntroduction.tsx
sed -i 's|className="w-20 px-2 py-1 border border-gray-300 rounded text-right flash-pink"|className={`w-20 px-2 py-1 border border-gray-300 rounded text-right ${data.percentage ? '\''input-filled'\'' : '\''flash-pink'\''}`}|g' src/components/survey/questions/Q24FuelSurchargeIntroduction.tsx

# Q26FuelProcurement.tsx
sed -i 's|className="w-full px-3 py-2 border border-gray-300 rounded-lg flash-pink"|className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${data.other.description ? '\''input-filled'\'' : '\''flash-pink'\''}`}|g' src/components/survey/questions/Q26FuelProcurement.tsx

# Q29TransactionTiers.tsx
sed -i 's|className="w-16 px-2 py-1 border border-gray-300 rounded text-right flash-pink"|className={`w-16 px-2 py-1 border border-gray-300 rounded text-right ${data[key].ratio ? '\''input-filled'\'' : '\''flash-pink'\''}`}|g' src/components/survey/questions/Q29TransactionTiers.tsx

# Q31CharterFeeLevel.tsx
sed -i 's|className="w-24 px-2 py-1 border border-gray-300 rounded text-right flash-pink"|className={`w-24 px-2 py-1 border border-gray-300 rounded text-right ${data[key].value ? '\''input-filled'\'' : '\''flash-pink'\''}`}|g' src/components/survey/questions/Q31CharterFeeLevel.tsx

# Q32CancellationFees.tsx - fixedAmount
sed -i 's|className={`w-full px-2 py-1 border border-gray-200 rounded text-right \${row?.useFixedAmount ? "flash-pink" : "disabled:bg-gray-100 disabled:text-gray-400"}`}|className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${row?.useFixedAmount ? (row?.fixedAmount ? '\''input-filled'\'' : '\''flash-pink'\'') : "disabled:bg-gray-100 disabled:text-gray-400"}`}|g' src/components/survey/questions/Q32CancellationFees.tsx

# Q32CancellationFees.tsx - fareRatio
sed -i 's|className={`w-full px-2 py-1 border border-gray-200 rounded text-right \${row?.useFareRatio ? "flash-pink" : "disabled:bg-gray-100 disabled:text-gray-400"}`}|className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${row?.useFareRatio ? (row?.fareRatio ? '\''input-filled'\'' : '\''flash-pink'\'') : "disabled:bg-gray-100 disabled:text-gray-400"}`}|g' src/components/survey/questions/Q32CancellationFees.tsx

# Q34EmptyRunFees.tsx - hourly rate
sed -i 's|className="w-24 px-2 py-1 border border-gray-300 rounded text-right flash-pink"|className={`w-24 px-2 py-1 border border-gray-300 rounded text-right ${data.calculationMethods.hourly.rate ? '\''input-filled'\'' : '\''flash-pink'\''}`}|g' src/components/survey/questions/Q34EmptyRunFees.tsx

# Q34EmptyRunFees.tsx - distance rate (need to handle separately)
# Q34EmptyRunFees.tsx - fareRatio ratio (need to handle separately)
# Q34EmptyRunFees.tsx - other description
sed -i 's|className="mt-2 w-full px-3 py-2 border border-gray-300 rounded flash-pink"|className={`mt-2 w-full px-3 py-2 border border-gray-300 rounded ${data.other.description ? '\''input-filled'\'' : '\''flash-pink'\''}`}|g' src/components/survey/questions/Q34EmptyRunFees.tsx

# Q35DiscountFees.tsx - otherDescription
sed -i 's|className="w-full px-2 py-1 border border-gray-300 rounded text-sm flash-pink"|className={`w-full px-2 py-1 border border-gray-300 rounded text-sm ${data.otherDescription ? '\''input-filled'\'' : '\''flash-pink'\''}`}|g' src/components/survey/questions/Q35DiscountFees.tsx

# Q35DiscountFees.tsx - fixedAmount
sed -i 's|className={`w-full px-2 py-1 border border-gray-200 rounded text-right \${itemData?.selected ? "flash-pink" : "disabled:bg-gray-100 disabled:text-gray-400"}`}|className={`w-full px-2 py-1 border border-gray-200 rounded text-right ${itemData?.selected ? (itemData?.fixedAmount ? '\''input-filled'\'' : '\''flash-pink'\'') : "disabled:bg-gray-100 disabled:text-gray-400"}`}|g' src/components/survey/questions/Q35DiscountFees.tsx

# Q35DiscountFees.tsx - percentage (need separate handling due to multiple occurrences)

# Q36SurchargeFees.tsx - otherDescription
sed -i 's|className="w-full px-2 py-1 border border-gray-300 rounded text-sm flash-pink"|className={`w-full px-2 py-1 border border-gray-300 rounded text-sm ${data.otherDescription ? '\''input-filled'\'' : '\''flash-pink'\''}`}|g' src/components/survey/questions/Q36SurchargeFees.tsx

# Q36SurchargeFees.tsx - fixedAmount & percentage (need separate handling)

# Q37FareBasis.tsx
sed -i 's|className="w-full px-3 py-2 border border-gray-300 rounded-lg flash-pink"|className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${data.other.description ? '\''input-filled'\'' : '\''flash-pink'\''}`}|g' src/components/survey/questions/Q37FareBasis.tsx

echo "Flash-pink updates completed!"
