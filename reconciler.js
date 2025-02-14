import { createDom } from "./renderer.js";
import { currentRoot, deletions, wipRoot } from "./scheduler.js";

const isFunctionalComponent = (fiber) => typeof fiber.type instanceof Function;

export const performUnitOfWork = (fiber) => {
	if (isFunctionalComponent(fiber)) {
		updateFunctionComponent(fiber);
	} else {
		updateHostComponent(fiber);
	}

	// 자식 -> 형제 -> 부모 순으로 탐색
	if (fiber.child) {
		return fiber.child;
	}

	let nextFiber = fiber;
	while (nextFiber) {
		if (nextFiber.sibling) {
			return nextFiber.sibling;
		}
		nextFiber = nextFiber.parent;
	}
};

const updateFunctionComponent = (fiber) => {
	const children = [fiber.type(fiber.props)];
	reconcileChildren(fiber, children);
};

const updateHostComponent = (fiber) => {
	if (!fiber.dom) {
		fiber.dom = createDom(fiber);
	}

	const elements = fiber.props.children;
	reconcileChildren(fiber, elements);
};

const reconcileChildren = (wipFiber, elements) => {
	let index = 0;
	let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
	let prevSibling = null;

	while (index < elements.length || oldFiber) {
		const element = elements[index];
		let newFiber = null;

		const sameType = oldFiber && element && element.type === oldFiber.type;

		if (sameType) {
			newFiber = {
				type: oldFiber.type,
				props: element.props,
				dom: oldFiber.dom,
				parent: wipFiber,
				alternate: oldFiber,
				effectTag: "UPDATE",
			};
		}

		if (element && !sameType) {
			newFiber = {
				type: element.type,
				props: element.props,
				dom: null,
				parent: wipFiber,
				alternate: null,
				effectTag: "PLACEMENT",
			};
		}

		if (oldFiber && !sameType) {
			oldFiber.effectTag = "DELETION";
			deletions.push(oldFiber);
		}
	}
};

export const commitRoot = () => {
	deletions.forEach(commitWork);
	commitWork(wipRoot.child);
	currentRoot = wipRoot;
	wipRoot = null;
};

const commitDeletion = (fiber, parentDom) => {
	if (fiber.dom) {
		parentDom.removeChild(fiber.dom);
	} else {
		commitDeletion(fiber.child, parentDom);
	}
};

export const commitWork = (fiber) => {
	if (!fiber) {
		return;
	}

	let parentFiber = fiber.parent;
	while (!parentFiber.dom) {
		parentFiber = parentFiber.parent;
	}
	const parentDom = parentFiber.dom;

	if (fiber.effectTag === "UPDATE" && fiber.dom) {
		updateDom(fiber.dom, fiber.alternate.props, fiber.props);
	} else if (fiber.effectTag === "PLACEMENT" && fiber.dom) {
		parentDom.appendChild(fiber.dom);
	} else if (fiber.effectTag === "DELETION") {
		commitDeletion(fiber, parentDom);
	}

	commitWork(fiber.child);
	commitWork(fiber.sibling);
};

const isEvent = (key) => key.startsWith("on");
const isProperty = (key) => key !== "children" && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (_, next) => (key) => !(key in next);

export const updateDom = (dom, prevProps, nextProps) => {
	Object.keys(prevProps)
		.filter(isEvent)
		.filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
		.forEach((key) => {
			const eventType = key.toLowerCase().substring(2);
			dom.removeEventListener(eventType, prevProps[key]);
		});

	Object.keys(prevProps)
		.filter(isProperty)
		.filter(isGone(prevProps, nextProps))
		.forEach((key) => {
			dom[key] = "";
		});

	Object.keys(nextProps)
		.filter(isProperty)
		.filter(isNew(prevProps, nextProps))
		.forEach((key) => {
			dom[key] = nextProps[key];
		});

	Object.keys(nextProps)
		.filter(isEvent)
		.filter(isNew(prevProps, nextProps))
		.forEach((key) => {
			const eventType = key.toLowerCase().substring(2);
			dom.addEventListener(eventType, nextProps[key]);
		});
};
