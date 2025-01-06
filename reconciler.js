import { createDom } from "./renderer.js";
import { currentRoot, wipRoot } from "./scheduler.js";

export const performUnitOfWork = (fiber) => {
	if (!fiber.dom) {
		fiber.dom = createDom(fiber);
	}

	// fiber 자식-형제 관계 설정
	const elements = fiber.props.children;
	let prevSibling = null;

	elements.forEach((element, index) => {
		const newFiber = {
			dom: null,
			parent: fiber,
			props: element.props,
			type: element.type,
		};

		if (index === 0) {
			fiber.child = newFiber;
		} else {
			prevSibling.sibling = newFiber;
		}

		prevSibling = newFiber;
	});

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
	parentDom.appendChild(fiber.dom);

	commitWork(fiber.child);
	commitWork(fiber.sibling);
};
