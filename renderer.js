const render = (element, container) => {
	const isElementText = typeof element === "string";
	const node = isElementText ? document.createTextNode(element) : document.createElement(element.type);

	props.children.forEach((child) => {
		render(child, node);
	});

	container.appendChild(node);
};

const renderer = {
	render,
};

export default renderer;
