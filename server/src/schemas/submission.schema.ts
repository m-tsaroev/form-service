import { z } from 'zod'

const answerValueSchema = z.union([z.string(), z.number(), z.array(z.string())])

const answerInputSchema = z.object({
	fieldId: z.number().int().positive(),
	value: answerValueSchema
})

const createSubmissionSchema = z
	.object({
		answers: z.array(answerInputSchema)
	})
	.strict()
	.superRefine((submission, context) => {
		const fieldIds = new Set<number>()

		for (const [index, answer] of submission.answers.entries()) {
			if (fieldIds.has(answer.fieldId)) {
				context.addIssue({
					code: 'custom',
					message: 'Each field can be answered only once',
					path: ['answers', index, 'fieldId']
				})
			}

			fieldIds.add(answer.fieldId)
		}
	})

const submissionParamsSchema = z.object({
	id: z.coerce.number().int().positive(),
	submissionId: z.coerce.number().int().positive()
})

type AnswerInput = z.infer<typeof answerInputSchema>
type AnswerValue = z.infer<typeof answerValueSchema>
type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>

export {
	answerInputSchema,
	answerValueSchema,
	createSubmissionSchema,
	submissionParamsSchema,
	type AnswerInput,
	type AnswerValue,
	type CreateSubmissionInput
}
