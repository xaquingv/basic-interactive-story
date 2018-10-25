import reqwest from 'reqwest'
import Handlebars from 'handlebars'
import { render, templates } from './renderHelpers'

Handlebars.registerPartial({
    text: templates["text"],
    scrollama: templates["scrollama"],
    meta: templates["meta"]
});

const template = Handlebars.compile(templates["main"]);

reqwest({
    url: 'http://projects.xocas.com.s3.amazonaws.com/documents/scrollama.json',
    type: 'json',
    success: (resp) => {
    	let html = template(resp);
    	render(html);
	}
});




