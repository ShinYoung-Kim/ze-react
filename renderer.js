const isElementText = (element) => typeof element === "string";
const isFunctionalComponent = (element) => element && typeof element.type === "function";

const pasteElementPropsToNode = (element, node) => {
	if (!element || !element.props) {
		return;
	}

	Object.keys(element.props)
		.filter((key) => key !== "children")
		.forEach((key) => {
			node[key] = element.props[key];
		});
};

const renderChildren = (element, node) => {
	if (!element || !element.props || !element.props.children) {
		return;
	}

	element.props.children.forEach((child) => {
		render(child, node);
	});
};

const getElement = (element) => {
	if (isFunctionalComponent(element)) {
		element = element.type(element.props, element.props.children);
	}

	return element;
};

const getNode = (element) => {
	if (isElementText(element)) {
		return document.createTextNode(element);
	}

	return document.createElement(element.type);
};

const render = (elements, container) => {
	elements = [].concat(elements);
	elements.forEach((element) => {
		const newElement = getElement(element);
		const node = getNode(newElement);

		pasteElementPropsToNode(newElement, node);
		renderChildren(newElement, node);

		container.appendChild(node);
	});
};

const renderer = {
	render,
};

export default renderer;
