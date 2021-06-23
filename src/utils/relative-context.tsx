import { createContext, h, Ref } from 'preact'
import { useContext } from 'preact/hooks'
import useMeasure, { RectReadOnly } from 'react-use-measure'
import { Children, CssClass } from './types'
import { join } from './utils'

/**
 * This file is used to provide 'relative' positioning via JS instead of CSS.
 * The reasoning for this is to overcome containers with 'overflow: hidden'
 * from hiding absolutely positioned elements like menus.
 *
 * @see https://css-tricks.com/popping-hidden-overflow/
 */

const DashboardContext = createContext<RectReadOnly>({} as any)

/** Defines a parent container to be used as the CSS 'relative' root.
 * Child elements will be relative to this container and can
 * access the parent's bounds to do custom positioning via JS.
 */
export function RelativeParent({ class: cls, children }: CssClass & Children) {
    const [ref, bounds] = useMeasure()
    return <div ref={ref} class={join('relative', cls)}>
        <DashboardContext.Provider value={bounds}>
            {children}
        </DashboardContext.Provider>
    </div>
}

/** Provides the position of the referenced child relative to the
 * 'relative parent root' along with the child's width and height.
 * This hook must be used on a child of a {@link RelativeParent} element.
 */
export function useRelativeBounds<RefT extends HTMLElement>(): [Ref<RefT>, RectReadOnly] {
    const parentBounds = useContext(DashboardContext)
    const [ref, childBounds] = useMeasure({ debounce: 250 })
    const relativeBounds = {
        width: childBounds.width,
        height: childBounds.height,
        top: childBounds.top - parentBounds.top,
        bottom: childBounds.bottom - parentBounds.bottom,
        left: childBounds.left - parentBounds.left,
        right: childBounds.right - parentBounds.right,
        x: childBounds.x - parentBounds.x,
        y: childBounds.y - parentBounds.y,
    }
    return [ref, relativeBounds]
}