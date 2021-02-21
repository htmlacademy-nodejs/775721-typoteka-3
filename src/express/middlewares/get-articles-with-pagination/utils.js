'use strict';

module.exports.createPaginationPages = ({quantity, currentPage}) => {
  const currentPageIndex = currentPage - 1;
  const isPreviousPageDisabled = currentPageIndex === 0;
  const isNextPageDisabled = currentPageIndex === quantity - 1;
  const previousPageHref = `?page=${ currentPage - 1 }`;
  const nextPageHref = `?page=${ currentPage + 1 }`;

  const previousPageLink = {
    title: `Назад`,
    label: `Страница назад`,
    href: previousPageHref,
    isDisabled: isPreviousPageDisabled,
    isPreviousPageLink: true,
  };

  const nextPageLink = {
    title: `Вперед`,
    label: `Страница вперед`,
    href: nextPageHref,
    isDisabled: isNextPageDisabled,
    isNextPageLink: true,
  };

  const pages = Array.from({length: quantity}, (_, index) => {
    const visibleIndex = index + 1;
    const isActive = index === currentPageIndex;
    const href = isActive ? null : `?page=${ visibleIndex }`;

    return {
      title: visibleIndex,
      href,
      isActive,
    };
  });

  return [previousPageLink, ...pages, nextPageLink];
};
