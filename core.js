const createElement = (type, props, ...children) => {
	return {
		type,
		props: {
			...props,
			children,
		},
	};
};

const core = {
	createElement,
};

export default core;
