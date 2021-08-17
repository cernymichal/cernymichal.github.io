export const updateLoading = (loadingBar: HTMLElement, loaded: number) => {
    console.log(`${loadingBar.id} - ${loaded * 100}% loaded`);
    loadingBar.style.width = `${loaded * 200}px`;
};
