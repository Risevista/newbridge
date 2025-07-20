/**
 * スクロールでビューに入った時にクラス名を追加してビジュアル効果をつける。
 * threshold コンポーネントの何割が表示された時に発動するかを設定。デフォルト0.2
 * target トリガー対象のHTMLエレメントへのquerySelectorのクエリ。デフォルトは全てのChildElements
 * changing クラス名を追加する対象。デフォルトはIntersectを観察する対象。
 * onExit   invisibleになる際に発動させる場合はtrue。
 * triggered トリガー対象のHTMLエレメントに追加するクラス名。デフォルト"open"
 */
export class ScrollTrigger extends HTMLElement {
    triggeredClass: string;
    previousY: number | null;
    previousRatio: number;
    changing?: Element | null | '';
    onExit?: boolean;
    constructor() {
        super();
        this.triggeredClass = this.dataset.triggered ?? 'open';
        this.previousY = null;
        this.previousRatio = 0;
        this.changing =
            this.dataset.changing &&
            document.querySelector(this.dataset.changing);
        this.onExit = Boolean(this.dataset.onexit);
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                const currentY = entry.boundingClientRect.height
                    ? entry.boundingClientRect.y
                    : null; // distance from root(if specified) or viewport top(At initial page draw invisible, all values are 0)
                const currentRatio = entry.intersectionRatio;
                if (entry.isIntersecting) {
                    if (
                        !this.onExit &&
                        (this.previousY === null ||
                            (currentY && currentY < this.previousY))
                    ) {
                        // entering from top(scroll down) or initial entry.  Show content,  Also triggered at initial draw if visible without scroll(in addition to  non isIntersecting trigger)
                        (this.changing || entry.target).classList.add(
                            this.triggeredClass,
                        );
                    } else if (
                        this.onExit &&
                        this.previousY &&
                        currentY !== null &&
                        currentY > this.previousY
                    ) {
                        // exit from bottom(scroll up). Hide or reset content.
                        (this.changing || entry.target).classList.remove(
                            this.triggeredClass,
                        );
                    } else if (this.previousY &&
                        currentY !== null &&
                        currentY > this.previousY
                    ) {
                        // enter from bottom(scroll up).  Show if hide
                        const target = this.changing || entry.target
                        if (!target.classList.contains(this.triggeredClass)) target.classList.add(this.triggeredClass)
                    }
                } else {
                    if (
                        this.previousY &&
                        !this.onExit &&
                        currentY &&
                        currentY > this.previousY &&
                        currentRatio < this.previousRatio
                    ) {
                        // Exit to bottom(scroll up) without previous intersection. Hide or reset content.  Actually entered threshold part from bottom
                        (this.changing || entry.target).classList.remove(
                            this.triggeredClass,
                        );
                    } else if (
                        this.onExit &&
                        ((currentY!== null && !this.previousY) ||
                            (this.previousY &&
                                currentY !== null &&
                                currentY < this.previousY &&
                                currentRatio < this.previousRatio))
                    ) {
                        // Exit to bottom(scroll up) without previous intersection. Hide or reset content.  Actually entered threshold part from bottom
                        (this.changing || entry.target).classList.add(
                            this.triggeredClass,
                        ); // Exiting to top
                    } else if (
                            this.previousY &&
                            !this.onExit &&
                            currentY &&
                            currentY < this.previousY
                    ) {
                        // exit to top(scroll down).  Show if hide
                        const target = this.changing || entry.target
                        if (!target.classList.contains(this.triggeredClass)) target.classList.add(this.triggeredClass)
                    }
                    // Mainly initial draw if else(like link with anchor)
                }
                this.previousY = currentY;
                this.previousRatio = currentRatio;
            });
        };
        // Fired when Intersection ratio changes, (intersection ratio is the area of the target element that is visible within the intersection root (or viewport if no root is specified) divided by the area of the target element itself.
        // Also fired when threshold(if set) crossings, visibility change(fully visible or hidden include initial draw)
        const observer = new IntersectionObserver(handleIntersection, {
            root: null,
            rootMargin: '0px',
            threshold: Number(this.dataset.threshold) || 0.2,
        });
        const elements = this.dataset.target
            ? this.querySelectorAll(this.dataset.target)
            : Array.from(this.children);
        elements.forEach((element) => observer.observe(element));
    }
}
customElements.define('scroll-trigger', ScrollTrigger);
