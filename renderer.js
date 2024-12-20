const render = (element, container) => {
	const isElementText = typeof element === "string";
	const node = isElementText ? document.createTextNode(element) : document.createElement(element.type);

	Object.keys(element.props)
		.filter((key) => key !== "children")
		.forEach((key) => {
			node[key] = element.props[key];
		});

	props.children.forEach((child) => {
		render(child, node);
	});

	container.appendChild(node);
};

const renderer = {
	render,
};

export default renderer;
