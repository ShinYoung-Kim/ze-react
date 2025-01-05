import { performUnitOfWork } from "./reconciler.js";

export let nextUnitOfWork = null;

const workLoop = () => {
	while (nextUnitOfWork) {
		nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
	}
	requestIdleCallback(workLoop);
};

requestIdleCallback(workLoop);
