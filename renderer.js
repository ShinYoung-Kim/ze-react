const isElementText = (element) => typeof element === "string";
const isFunctionalComponent = (element) => typeof element.type === "function";

const pasteElementPropsToNode = (element, node) => {
	if (!element.props) {
		return;
	}

	Object.keys(element.props)
		.filter((key) => key !== "children")
		.forEach((key) => {
			node[key] = element.props[key];
		});
};

const renderChildren = (element, node) => {
	if (!element.props || !element.props.children) {
		return;
	}

	element.props.children.forEach((child) => {
		render(child, node);
	});
};

const getNode = (element) => {
	let node;

	if (isElementText(element)) {
		node = document.createTextNode(element);
	} else if (isFunctionalComponent(element)) {
		const component = element.type(element.props);
		node = getNode(component);
	} else {
		node = document.createElement(element.type);
	}

	pasteElementPropsToNode(element, node);

	return node;
};

const render = (element, container) => {
	const node = getNode(element);

	renderChildren(element, node);

	container.appendChild(node);
};

const renderer = {
	render,
};

export default renderer;
