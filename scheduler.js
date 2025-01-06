import { performUnitOfWork, commitRoot } from "./reconciler.js";

export let nextUnitOfWork = null;
export let wipRoot = null;
export let currentRoot = null;

const workLoop = () => {
	while (nextUnitOfWork) {
		nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
	}

	if (!nextUnitOfWork && wipRoot) {
		commitRoot();
	}

	requestIdleCallback(workLoop);
};

requestIdleCallback(workLoop);
