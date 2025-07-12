// Debug the exact timestamp issue with July 3, 2025

// Your data shows: 2025-07-03: 3 submissions
// Let's calculate what timestamp that should be

const july3_2025_start = new Date('2025-07-03T00:00:00Z'); // UTC
const july3_2025_local = new Date('2025-07-03T00:00:00'); // Local time
const july3_2025_ist = new Date('2025-07-03T00:00:00+05:30'); // IST

console.log('July 3, 2025 timestamp calculations:');
console.log('===================================');
console.log(`UTC midnight: ${Math.floor(july3_2025_start.getTime() / 1000)}`);
console.log(`Local midnight: ${Math.floor(july3_2025_local.getTime() / 1000)}`);
console.log(`IST midnight: ${Math.floor(july3_2025_ist.getTime() / 1000)}`);

// Now let's reverse engineer - if the heatmap is showing July 4 data on July 3,
// what timestamp would that be?
const july4_2025_utc = new Date('2025-07-04T00:00:00Z');
console.log(`\nJuly 4, 2025 UTC midnight: ${Math.floor(july4_2025_utc.getTime() / 1000)}`);

// Check if LeetCode timestamps might be in PST/PDT (California time)
const july3_2025_pst = new Date('2025-07-03T00:00:00-08:00'); // PST
const july3_2025_pdt = new Date('2025-07-03T00:00:00-07:00'); // PDT
console.log(`\nPST midnight July 3: ${Math.floor(july3_2025_pst.getTime() / 1000)}`);
console.log(`PDT midnight July 3: ${Math.floor(july3_2025_pdt.getTime() / 1000)}`);

// Test conversion back
const testTimestamp = Math.floor(july3_2025_start.getTime() / 1000);
const convertedDate = new Date(testTimestamp * 1000);
console.log(`\nRound trip test:`);
console.log(`Original: July 3, 2025`);
console.log(`Timestamp: ${testTimestamp}`);
console.log(`Converted back: ${convertedDate.toISOString().split('T')[0]}`);
console.log(`Local date: ${convertedDate.getFullYear()}-${String(convertedDate.getMonth() + 1).padStart(2, '0')}-${String(convertedDate.getDate()).padStart(2, '0')}`);
