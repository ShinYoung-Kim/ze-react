const workLoop = () => {
	requestIdleCallback(workLoop);
};

requestIdleCallback(workLoop);
