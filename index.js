    document.getElementById('fileInput').addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        const content = e.target.result;
        const data = JSON.parse(content);

        document.getElementById('uploadPage').classList.add('hidden');
        document.getElementById('dashboardPage').classList.remove('hidden');

        generateDashboard(data);
      };
      reader.readAsText(file);
    });

    function generateDashboard(data) {
      const prices = data.map(d => +d.price);
      const flightClasses = data.map(d => d.class);
      const routes = data.map(d => `${d.source_city} → ${d.destination_city}`);

      // 1. Bar Chart - Average Ticket Price by Airline
      let airlineMap = {};
      data.forEach(d => {
        if (!airlineMap[d.airline]) airlineMap[d.airline] = [];
        airlineMap[d.airline].push(+d.price);
      });
      const airlines = Object.keys(airlineMap);
      const avgPrices = airlines.map(a => {
        const list = airlineMap[a];
        return list.reduce((s, p) => s + p, 0) / list.length;
      });
      Plotly.newPlot('chart1', [{
        x: airlines,
        y: avgPrices,
        type: 'bar',
        marker: { color: 'steelblue' }
      }], { title: 'Average Ticket Price by Airline', autosize: true });

      // 2. Pie Chart - Ticket Distribution by Class
      const classCount = {};
      flightClasses.forEach(c => {
        classCount[c] = (classCount[c] || 0) + 1;
      });
      Plotly.newPlot('chart2', [{
        labels: Object.keys(classCount),
        values: Object.values(classCount),
        type: 'pie'
      }], { title: 'Ticket Distribution by Class', autosize: true });

      // 3. Histogram - Price Distribution
      Plotly.newPlot('chart3', [{
        x: prices,
        type: 'histogram',
        marker: { color: 'orange' }
      }], { title: 'Histogram: Price Distribution', autosize: true });

      // 4. Donut Chart - Ticket Count by Class
      Plotly.newPlot('chart4', [{
        labels: Object.keys(classCount),
        values: Object.values(classCount),
        type: 'pie',
        hole: 0.4
      }], { title: 'Donut Chart: Ticket Count by Class', autosize: true });
    }