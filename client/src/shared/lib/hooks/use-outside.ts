import {
	type Dispatch,
	type RefObject,
	type SetStateAction,
	useEffect,
	useRef,
	useState
} from 'react'

interface TypeOut<T extends HTMLElement> {
	ref: RefObject<T | null>
	isShow: boolean
	setIsShow: Dispatch<SetStateAction<boolean>>
	isClickOutside: boolean
}

const useOutside = <RefElementType extends HTMLElement>(
	initialState: boolean
): TypeOut<RefElementType> => {
	const [isShow, setIsShow] = useState<boolean>(initialState)
	const [isClickOutside, setIsClickOutside] = useState<boolean>(false)
	const ref = useRef<RefElementType | null>(null)

	const handleClickOutside = (event: Event) => {
		if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
			setIsShow(false)

			setIsClickOutside(true)

			setTimeout(() => {
				setIsClickOutside(false)
			}, 500)
		}
	}

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true)

		return () => {
			document.removeEventListener('click', handleClickOutside, true)
		}
	}, [])

	return { ref, isShow, setIsShow, isClickOutside }
}

export { useOutside }
