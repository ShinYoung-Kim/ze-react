import { createDom } from "./renderer.js";
import { currentRoot, wipRoot } from "./scheduler.js";

export const performUnitOfWork = (fiber) => {
	if (!fiber.dom) {
		fiber.dom = createDom(fiber);
	}

	// fiber 자식-형제 관계 설정
	const elements = fiber.props.children;
	reconcileChildren(fiber, elements);

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
	}
};

export const commitRoot = () => {
	commitWork(wipRoot.child);
	currentRoot = wipRoot;
	wipRoot = null;
};

export const commitWork = (fiber) => {
	if (!fiber) {
		return;
	}

	const parentDom = fiber.parent.dom;
	if (fiber.effectTag === "UPDATE" && fiber.dom) {
		updateDom(fiber.dom, fiber.alternate.props, fiber.props);
	} else if (fiber.effectTag === "PLACEMENT" && fiber.dom) {
		parentDom.appendChild(fiber.dom);
	}

	commitWork(fiber.child);
	commitWork(fiber.sibling);
};
