import * as d3 from 'd3'
import 'intersection-observer';
import stickyfill from 'stickyfill'
import scrollama from 'scrollama';

// using d3 for convenience
const container = d3.select('#scroll');
const graphic = container.select('.scroll__graphic');
const chart = graphic.select('.chart');
const text = container.select('.scroll__text');
const step = text.selectAll('.step');
const Stickyfill = stickyfill();

// initialize the scrollama
const scroller = scrollama();

// generic window resize listener event
function handleResize() {
	// 1. update height of step elements
	const stepHeight = Math.floor(window.innerHeight * 0.75);
	step.style('height', stepHeight + 'px');

	// 2. update width/height of graphic element
	const bodyWidth = d3.select('body').node().offsetWidth;
	const textWidth = text.node().offsetWidth;

	const graphicWidth = bodyWidth - textWidth;

	graphic
		.style('width', graphicWidth + 'px')
		.style('height', window.innerHeight + 'px');

	const chartMargin = 32;
	const chartWidth = graphic.node().offsetWidth - chartMargin;

	chart
		.style('width', chartWidth + 'px')
		.style('height', Math.floor(window.innerHeight / 2) + 'px');


	// 3. tell scrollama to update new element dimensions
	scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) {
	// response = { element, direction, index }

	// add color to current step only
	step.classed('is-active', function (d, i) {
		return i === response.index;
	})

	// update graphic based on step
	chart.select('p').text(response.index + 1)

	console.log(response.direction, response.index)
}

function handleContainerEnter(response) {
	// response = { direction }
}

function handleContainerExit(response) {
	// response = { direction }
}

function setupStickyfill() {
	d3.selectAll('.sticky').each(function () {
		Stickyfill.add(this);
	});
}

function init() {
	setupStickyfill();

	// 1. force a resize on load to ensure proper dimensions are sent to scrollama
	handleResize();

	// 2. setup the scroller passing options
	// this will also initialize trigger observations
	// 3. bind scrollama event handlers (this can be chained like below)
	scroller.setup({
		container: '#scroll',
		graphic: '.scroll__graphic',
		text: '.scroll__text',
		step: '.scroll__text .step',
		debug: true,
	})
		.onStepEnter(handleStepEnter)
		.onContainerEnter(handleContainerEnter)
		.onContainerExit(handleContainerExit);

	// setup resize event
	window.addEventListener('resize', handleResize);
}

// kick things off
init();