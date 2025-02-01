import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'd3';

const projects = await fetchJSON('/portfolio/lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');

projectsTitle.textContent = `${projects.length} Projects`;

renderProjects(projects, projectsContainer, 'h2');

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let data = [1, 2, 3, 4, 5, 5];

let sliceGenerator = d3.pie();
let arcData = sliceGenerator(data);

let colors = d3.scaleOrdinal(d3.schemeTableau10);

let arcs = arcData.map((d) => arcGenerator(d));

arcs.forEach((arc, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors[idx]);
});