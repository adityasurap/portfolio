import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const projects = await fetchJSON('/portfolio/lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');

projectsTitle.textContent = `${projects.length} Projects`;

renderProjects(projects, projectsContainer, 'h2');

let selectedIndex = -1;

function renderPieChart(projectsGiven) {
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let newArcs = newArcData.map((d) => newArcGenerator(d));

  let newSVG = d3.select('svg');
  newSVG.selectAll('path').remove();

  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  newArcs.forEach((arc, index) => {
    newSVG.append('path')
      .attr('d', arc)
      .attr('fill', colors(index))
      .on('click', () => {
        selectedIndex = selectedIndex === index ? -1 : index;

        newSVG
          .selectAll('path')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

        legend
          .selectAll('li')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

        if (selectedIndex === -1) {
          renderProjects(projectsGiven, projectsContainer, 'h2');
        } else {
          let filteredProjects = projectsGiven.filter(project => project.year === newData[selectedIndex].label);
          renderProjects(filteredProjects, projectsContainer, 'h2');
        }
      });
  });

  newData.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

renderPieChart(projects);

let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
  query = event.target.value;

  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});

