// Test timestamp conversion for debugging date shift issue

// Example timestamp from July 3, 2025 (should be 3 submissions)
// Let's test with some timestamps around that date

// July 3, 2025 midnight UTC timestamp would be: 1751760000
// July 3, 2025 midnight local time (assuming GMT+5:30 India) would be different

const testTimestamps = [
    1751760000, // July 3, 2025 00:00 UTC
    1751780400, // July 3, 2025 05:40 UTC (approx)
    1751846400, // July 4, 2025 00:00 UTC
];

console.log('Testing timestamp conversions:');
console.log('==============================');

testTimestamps.forEach(ts => {
    const date = new Date(ts * 1000);
    
    // UTC version (old method)
    const utcDateKey = date.toISOString().split('T')[0];
    
    // Local timezone version (new method)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const localDateKey = `${year}-${month}-${day}`;
    
    console.log(`Timestamp: ${ts}`);
    console.log(`  Date object: ${date.toString()}`);
    console.log(`  UTC date (old): ${utcDateKey}`);
    console.log(`  Local date (new): ${localDateKey}`);
    console.log(`  toDateString(): ${date.toDateString()}`);
    console.log('---');
});

// Let's also test the reverse - what timestamp would July 3, 2025 be?
const july3_2025 = new Date('2025-07-03T00:00:00');
const july3_timestamp = Math.floor(july3_2025.getTime() / 1000);
console.log(`July 3, 2025 timestamp: ${july3_timestamp}`);
