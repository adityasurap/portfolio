let data = [];
let commits = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  createScatterplot();
});

function processCommits() {
    commits = d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        let ret = {
          id: commit,
          url: 'https://github.com/adityasurap/portfolio/commit/' + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
        };
  
        Object.defineProperty(ret, 'lines', {
          value: lines,
          configurable: true,
          writable: true,
          enumerable: false,
        });
  
        return ret;
    });
}

function displayStats() {
    processCommits();
  
    const dl = d3.select('#stats').append('dl').attr('class', 'stats');
  
    dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);
  
    dl.append('dt').text('Total Commits');
    dl.append('dd').text(commits.length);

    const numFiles = d3.group(data, d => d.file).size;
    dl.append('dt').text('Number of Files');
    dl.append('dd').text(numFiles);

    const longestFile = d3.rollups(data, v => d3.max(v, d => d.line), d => d.file);
    const maxFile = d3.max(longestFile, d => d[1]);
    dl.append('dt').text('Longest File');
    dl.append('dd').text(maxFile);

    const longestLine = d3.max(data, d => d.length);
    dl.append('dt').text('Longest Line Length');
    dl.append('dd').text(longestLine);

    const workByPeriod = d3.rollups(
        data,
        (v) => v.length,
        (d) => {
          const hour = new Date(d.datetime).getHours();
          if (hour < 6) return 'Night';
          if (hour < 12) return 'Morning';
          if (hour < 18) return 'Afternoon';
          return 'Evening';
        }
      );
      const maxPeriod = d3.greatest(workByPeriod, d => d[1])?.[0];
      dl.append('dt').text('Most Work Done In');
      dl.append('dd').text(maxPeriod);
}

async function loadData() {
  data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: Number(row.line),
    depth: Number(row.depth),
    length: Number(row.length),
    date: new Date(row.date + 'T00:00' + row.timezone),
    datetime: new Date(row.datetime),
  }));

  displayStats();
}

let xScale;
let yScale;

function createScatterplot() {
  const width = 1000;
  const height = 600;
  const margin = { top: 10, right: 10, bottom: 30, left: 20 };

  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');

  xScale = d3
        .scaleTime()
        .domain(d3.extent(commits, (d) => d.datetime))
        .range([0, width])
        .nice();
  
  yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);

  const usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };

  xScale.range([usableArea.left, usableArea.right]);
  yScale.range([usableArea.bottom, usableArea.top]);

  const gridlines = svg
    .append('g')
    .attr('class', 'gridlines')
    .attr('transform', `translate(${usableArea.left}, 0)`);
  
    gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));

  const xAxis = d3.axisBottom(xScale);
  
  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat((d) => String(d % 24).padStart(2, '0') + ':00');

  svg
    .append('g')
    .attr('transform', `translate(0, ${usableArea.bottom})`)
    .call(xAxis);
  
  svg
    .append('g')
    .attr('transform', `translate(${usableArea.left}, 0)`)
    .call(yAxis);

  const dots = svg.append('g').attr('class', 'dots');

  dots
    .selectAll('circle')
    .data(commits)
    .join('circle')
    .attr('cx', (d) => xScale(d.datetime))
    .attr('cy', (d) => yScale(d.hourFrac))
    .attr('r', 5)
    .attr('fill', 'steelblue');
}