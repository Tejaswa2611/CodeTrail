// Debug script to convert timestamps from calendar data
const submissionCalendar = "{\"1735948800\": 6, \"1736035200\": 9, \"1736121600\": 3, \"1736380800\": 8, \"1736553600\": 2, \"1736899200\": 6, \"1736985600\": 1, \"1737158400\": 2, \"1737244800\": 1, \"1737504000\": 3, \"1743638400\": 1, \"1747785600\": 3, \"1747872000\": 6, \"1747958400\": 13, \"1748044800\": 2, \"1748649600\": 14, \"1748736000\": 1, \"1748822400\": 13, \"1748908800\": 3, \"1748995200\": 19, \"1749081600\": 16, \"1749168000\": 12, \"1749254400\": 23, \"1749427200\": 17, \"1749513600\": 10, \"1749686400\": 7, \"1749772800\": 8, \"1749859200\": 4, \"1750118400\": 1, \"1751500800\": 3, \"1751587200\": 17, \"1751673600\": 1, \"1751760000\": 1, \"1751846400\": 8, \"1751932800\": 10, \"1752019200\": 8, \"1752105600\": 1, \"1722297600\": 1, \"1722470400\": 29, \"1722556800\": 3, \"1722643200\": 6, \"1722729600\": 5, \"1722816000\": 39, \"1722902400\": 7, \"1722988800\": 16, \"1723075200\": 17, \"1723161600\": 19, \"1723248000\": 13, \"1723334400\": 27, \"1723420800\": 24, \"1723507200\": 11, \"1723593600\": 4, \"1723680000\": 9, \"1724025600\": 10, \"1724284800\": 7, \"1724371200\": 20, \"1724630400\": 1, \"1727136000\": 7, \"1728259200\": 1, \"1728604800\": 18, \"1728691200\": 14, \"1728777600\": 28, \"1728950400\": 7, \"1729123200\": 5, \"1729209600\": 8, \"1729296000\": 11, \"1729468800\": 1, \"1729555200\": 4, \"1730592000\": 16, \"1730678400\": 9, \"1730764800\": 4, \"1732147200\": 2, \"1732320000\": 1, \"1733011200\": 1, \"1733184000\": 5, \"1733270400\": 6, \"1733356800\": 1, \"1733443200\": 4, \"1733616000\": 2, \"1733702400\": 3, \"1733788800\": 8, \"1733875200\": 5, \"1734048000\": 2, \"1734220800\": 3, \"1734307200\": 3, \"1734393600\": 10, \"1734480000\": 11, \"1734566400\": 5, \"1734912000\": 14, \"1735430400\": 9, \"1735516800\": 17}";

const calendar = JSON.parse(submissionCalendar);

console.log('📅 Calendar Data Analysis:');
console.log('Total days with submissions:', Object.keys(calendar).length);

// Convert to readable dates and group by month
const byMonth = {};
Object.entries(calendar).forEach(([timestamp, count]) => {
    const date = new Date(parseInt(timestamp) * 1000);
    const yearMonth = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
    const dateString = date.toISOString().split('T')[0];
    
    if (!byMonth[yearMonth]) {
        byMonth[yearMonth] = [];
    }
    byMonth[yearMonth].push({
        date: dateString,
        count: count,
        readable: date.toDateString()
    });
});

// Sort months and display
Object.keys(byMonth).sort().forEach(month => {
    console.log(`\n📆 ${month}:`);
    byMonth[month].sort((a, b) => a.date.localeCompare(b.date)).forEach(entry => {
        console.log(`  ${entry.date} (${entry.readable}): ${entry.count} submissions`);
    });
});

// Check July 2025 specifically
console.log('\n🎯 July 2025 Data:');
const july2025 = byMonth['2025-07'] || [];
if (july2025.length > 0) {
    july2025.forEach(entry => {
        console.log(`  ${entry.date}: ${entry.count} submissions`);
    });
} else {
    console.log('  No July 2025 data found');
}

// Generate expected heatmap format
console.log('\n🗺️ Expected Heatmap Format:');
const heatmapFormat = {};
Object.entries(calendar).forEach(([timestamp, count]) => {
    const date = new Date(parseInt(timestamp) * 1000);
    const dateString = date.toISOString().split('T')[0];
    heatmapFormat[dateString] = count;
});

console.log('Sample heatmap entries:');
Object.entries(heatmapFormat).slice(0, 10).forEach(([date, count]) => {
    console.log(`  "${date}": ${count}`);
});
