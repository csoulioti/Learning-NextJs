import React, { memo, useCallback } from 'react'

import debounce from 'debounce'
import { useFormContext, useWatch } from 'react-hook-form'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { Box, CircularProgress } from '@mui/material'

type Props = {
	defaultValues: any
	onSubmit: any
}
const AutoSave = memo(({ defaultValues, onSubmit }: Props) => {
	// Get the closest form methods
	const methods = useFormContext()

	// Save if this function is called and then not called again within 1000ms
	// eslint-disable-next-line
	const debouncedSave = useCallback(
		debounce(() => {
			console.log('Saving')
			methods.handleSubmit(onSubmit)()
		}, 1000),
		[],
	)

	// Watch all the data, provide with defaultValues from server, this way we know if the new data came from server or where actually edited by user
	const watchedData = useWatch({
		control: methods.control,
		defaultValue: defaultValues,
	})

	//
	/* It's React's useEffect hook, except using deep comparison on the inputs, not reference equality
        React's built-in useEffect hook has a second argument called the "dependencies array" 
        and it allows you to optimize when React will call your effect callback.
        React will do a comparison between each of the values (via Object.is) to determine whether your effect callback should be called.
        The problem is that if you need to provide an object for one of those dependencies and that object is new every render, 
        then even if none of the properties changed, your effect will get called anyway.
    */
	useDeepCompareEffect(() => {
		console.log('Triggered')
		if (methods.formState.isDirty) {
			debouncedSave()
		}
	}, [watchedData])

	return (
		<Box mt={2} height={20}>
			{methods.formState.isSubmitting && (
				<CircularProgress color="secondary" size={20} />
			)}
		</Box>
	)
})

AutoSave.displayName = 'AutoSave'

export default AutoSave
