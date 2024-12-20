const isElementText = (element) => typeof element === "string";

const getNode = (element) => {
	if (isElementText(element)) {
		return document.createTextNode(element);
	}

	return document.createElement(element.type);
};

const render = (element, container) => {
	const node = getNode(element);

	if (element.props) {
		Object.keys(element.props)
			.filter((key) => key !== "children")
			.forEach((key) => {
				node[key] = element.props[key];
			});

		element.props.children.forEach((child) => {
			render(child, node);
		});
	}

	container.appendChild(node);
};

const renderer = {
	render,
};

export default renderer;
