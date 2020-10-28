import { AnimationController } from "@ionic/angular";
const animationCtrl = new AnimationController();

export const getIonPageElement = (element: HTMLElement) => {
  if (element.classList.contains("ion-page")) {
    return element;
  }

  const ionPage = element.querySelector(
    ":scope > .ion-page, :scope > ion-nav, :scope > ion-tabs"
  );
  if (ionPage) {
    return ionPage;
  }
  // idk, return the original element so at least something animates and we don't have a null pointer
  return element;
};
export const fancyAnimation = (_: HTMLElement, opts: any) => {
  const backDirection = opts.direction === "back";
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;

  const enteringPageEl = getIonPageElement(enteringEl);

  const rootTransition = animationCtrl.create();

  const enterTransition = animationCtrl.create();
  const leavingTransition = animationCtrl.create();

  leavingTransition
    .addElement(getIonPageElement(leavingEl))
    .duration(350)
    .fill("both");

  enterTransition
    .addElement(enteringPageEl)
    .duration(350)
    .fill("both")
    .beforeRemoveClass("ion-page-invisible")
    .beforeRemoveClass("backdrop");

  if (!backDirection) {
    leavingTransition.beforeAddClass("backdrop");

    enterTransition.keyframes([
      { offset: 0, transform: "translate3d(100%,0,0)" },
      { offset: 1, transform: "translate3d(0,0,0)" },
    ]);

    leavingTransition.keyframes([
      { offset: 0, transform: "translate3d(0,0,0)", opacity: "1" },
      { offset: 1, transform: "translate3d(-10%,0,0)", opacity: "1" },
    ]);

  } else {
    enterTransition.keyframes([
      { offset: 0, transform: "translate3d(-10%,0,0)", opacity: "1" },
      { offset: 1, transform: "translate3d(0,0,0)", opacity: "1" },
    ]);

    leavingTransition.keyframes([
      { offset: 0, transform: "translate3d(0,0,0)" },
      { offset: 1, transform: "translate3d(100%,0,0)" },
    ]);
  }

  rootTransition
    .easing("ease")
    .addAnimation([enterTransition, leavingTransition]);

  return rootTransition;
};

export const fancyTopAnimation = (_: HTMLElement, opts: any) => {
  const backDirection = opts.direction === "back";
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;

  const enteringPageEl = getIonPageElement(enteringEl);

  const rootTransition = animationCtrl.create();

  const enterTransition = animationCtrl.create();
  const leavingTransition = animationCtrl.create();

  leavingTransition
    .addElement(getIonPageElement(leavingEl))
    .duration(350)
    .fill("both");

  enterTransition
    .addElement(enteringPageEl)
    .duration(350)
    .fill("both")
    .beforeRemoveClass("ion-page-invisible")
    .beforeRemoveClass("backdrop");

  if (!backDirection) {
    leavingTransition.beforeAddClass("backdrop");

    enterTransition.keyframes([
      { offset: 0, transform: "translate3d(0,100%,0)" },
      { offset: 1, transform: "translate3d(0,0,0)" },
    ]);

    leavingTransition.keyframes([
      { offset: 0, transform: "translate3d(0,0,0)", opacity: "1" },
      { offset: 1, transform: "translate3d(0,0,0)", opacity: "1" },
    ]);

  } else {
    enterTransition.keyframes([
      { offset: 0, transform: "translate3d(0,0,0)", opacity: "1" },
      { offset: 1, transform: "translate3d(0,0,0)", opacity: "1" },
    ]);

    leavingTransition.keyframes([
      { offset: 0, transform: "translate3d(0,0,0)" },
      { offset: 1, transform: "translate3d(0,100%,0)" },
    ]);
  }

  rootTransition
    .easing("ease")
    .addAnimation([enterTransition, leavingTransition]);

  return rootTransition;
};

export const scaleAnimation = (_: HTMLElement, opts: any) => {
  const backDirection = opts.direction === "back";
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;

  const enteringPageEl = getIonPageElement(enteringEl);

  const rootTransition = animationCtrl.create();

  const enterTransition = animationCtrl.create();
  const leavingTransition = animationCtrl.create();

  leavingTransition
    .addElement(getIonPageElement(leavingEl))
    .duration(250)
    .fill("both");

  enterTransition
    .addElement(enteringPageEl)
    .duration(250)
    .fill("both")
    .beforeRemoveClass("ion-page-invisible")
    .beforeRemoveClass("backdrop");

  if (!backDirection) {
    leavingTransition.beforeAddClass("backdrop");

    enterTransition.keyframes([
      { offset: 0, transform: "scale(0)",  opacity: "0" },
      { offset: 1, transform: "scale(1)", opacity: "1" },
    ]);

    leavingTransition.keyframes([
      { offset: 0, transform: "scale(1)", opacity: "1" },
      { offset: 1, transform: "scale(1)", opacity: "1" },
    ]);

  } else {
    enterTransition.keyframes([
      { offset: 0, transform: "scale(1)", opacity: "1" },
      { offset: 1, transform: "scale(1)", opacity: "1" },
    ]);

    leavingTransition.keyframes([
      { offset: 0, transform: "scale(1)",  opacity: "1" },
      { offset: 1, transform: "scale(0)",  opacity: "0" },
    ]);
  }

  rootTransition
    .easing("ease")
    .addAnimation([enterTransition, leavingTransition]);

  return rootTransition;
};

export const modalEnterAnimation = (baseEl: any) => {
  const backdropAnimation = animationCtrl
    .create()
    .addElement(baseEl.querySelector("ion-backdrop")!)
    .fromTo("opacity", "0.01", "0.51")
    .duration(150);

  const wrapperAnimation = animationCtrl
    .create()
    .addElement(baseEl.querySelector(".modal-wrapper")!)
    .keyframes([
      { offset: 0, opacity: "1", transform: "translate3d(0,100%,0)" },
      { offset: 1, opacity: "1", transform: "translate3d(0,0,0)" },
    ])
    .duration(250);

  return animationCtrl
    .create()
    .addElement(baseEl)
    .easing("ease")
    .addAnimation([backdropAnimation, wrapperAnimation]);
};

export const modalLeaveAnimation = (baseEl: any) => {
  return modalEnterAnimation(baseEl).direction("reverse");
};
