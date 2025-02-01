import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'd3';

const projects = await fetchJSON('/portfolio/lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');

projectsTitle.textContent = `${projects.length} Projects`;

renderProjects(projects, projectsContainer, 'h2');

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let arc = arcGenerator({
    startAngle: 0,
    endAngle: 2 * Math.PI,
  });

  d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');