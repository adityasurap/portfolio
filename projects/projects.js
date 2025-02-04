import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const projects = await fetchJSON('/portfolio/lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');

projectsTitle.textContent = `${projects.length} Projects`;

renderProjects(projects, projectsContainer, 'h2');

let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year,
);

let data = rolledData.map(([year, count]) => {
  return { value: count, label: year };
});

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);

let colors = d3.scaleOrdinal(d3.schemeTableau10);

let arcs = arcData.map((d) => arcGenerator(d));

arcs.forEach((arc, index) => {
    d3.select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(index));
});

let legend = d3.select('.legend');
data.forEach((d, idx) => {
    legend.append('li')
          .attr('style', `--color:${colors(idx)}`)
          .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
});