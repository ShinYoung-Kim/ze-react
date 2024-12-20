import renderer from "./renderer.js";
import core from "./core.js";

const functionalComponent = (props, children) => {
	return core.createElement(
		"span",
		{
			style: "color: blue; font-size: 16px;",
			...props,
		},
		children
	);
};

export const createDefaultElement = () =>
	renderer.render(
		core.createElement(
			"h1",
			{
				style: "color: red; font-size: 20px;",
			},
			"Hello, ze-react!"
		),
		document.getElementById("app")
	);

export const createFunctionalElement = () =>
	renderer.render(core.createElement(functionalComponent, null, "Welcome!"), document.getElementById("app"));

export const createNestedFunctionalElement = () =>
	renderer.render(
		core.createElement(
			functionalComponent,
			null,
			core.createElement(
				functionalComponent,
				{
					style: "color: green; font-size: 12px;",
				},
				"hihi"
			)
		),
		document.getElementById("app")
	);
