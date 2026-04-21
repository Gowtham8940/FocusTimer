# Example Firestore Data Models

## users/{userId}
- displayName: string
- email: string | null
- createdAt: number

## users/{userId}/notes/{noteId}
- text: string
- categoryId: string | null
- sessionId: string | null
- createdAt: number
- updatedAt: number

## users/{userId}/sessions/{sessionId}
- startedAt: number
- endedAt: number
- durationSeconds: number
- completed: boolean
- categoryId: string
- subcategoryId: string | null

## dailyReports/{dateKey}_{userId}
- userId: string
- dateKey: string (YYYY-MM-DD)
- totalSeconds: number
- byCategory: map<string, number>
