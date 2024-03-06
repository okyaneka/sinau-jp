import data from '~/data/chars.json'

export interface QuestionChar {
  jp: string
  roman: string
  type: 'hiragana' | 'katakana'
}

export interface Question {
  jp: string
  roman: string
}

export interface QuestionAnswers {
  question: Question
  answers: QuestionAnswer[]
}

export interface QuestionAnswer {
  answer: string
  correct: boolean
}

export interface QuestionResults {
  time: number
  answers: QuestionAnswers[]
}

// @ts-ignore
export const questionChars: QuestionChar[] = data.chars

const chishi = ['し', 'シ', 'ち', 'チ']
const aiueo = ['あ', 'ア', 'い', 'イ', 'う', 'ウ', 'え', 'エ', 'お', 'オ']
const tsu = ['ッ', 'っ']
const en = ['ん', 'ン']
const yayuyo = ['ゃ', 'ゅ', 'ょ', 'ャ', 'ュ', 'ョ']
const yayuyoyes = [
  'き',
  'し',
  'ち',
  'に',
  'ひ',
  'み',
  'り',
  'ぎ',
  'じ',
  'ぢ',
  'び',
  'ぴ',
  'キ',
  'シ',
  'チ',
  'ニ',
  'ヒ',
  'ミ',
  'リ',
  'ギ',
  'ジ',
  'ヂ',
  'ビ',
  'ピ'
]

function filterChar(char: string, v: QuestionChar, lastChar: boolean) {
  if (en.includes(v.jp) && !char) return false
  if (tsu.includes(v.jp) && (tsu.includes(char) || !char || lastChar || aiueo.includes(char)))
    return false
  if (yayuyo.includes(v.jp) && (!char || !yayuyoyes.includes(char))) return false
  return true
}

/**
 *
 * @param gaku
 * @param onsetsu
 * @returns a:Question[]
 */
export function questionGenerate(
  type: QuestionChar['type'],
  gaku: number,
  onsetsu: number
): Question[] {
  const hiragana = questionChars.filter((v) => v.type == type)

  return new Array(gaku).fill(0).reduce<Question[]>((u, v) => {
    const question = new Array(onsetsu).fill(0).reduce<Question>(
      (u1, v1, i) => {
        const chars = hiragana.filter((v) => filterChar(u1.jp.slice(-1), v, i + 1 == onsetsu))
        const YAYUYO = hiragana.filter((v) => yayuyo.includes(v.jp))

        const useYayuyo = yayuyoyes.some((v) => v == u1.jp) && Math.random() * 2 > 1
        const char = useYayuyo
          ? YAYUYO[Math.floor(Math.random() * YAYUYO.length)]
          : chars[Math.floor(Math.random() * chars.length)]

        u1.jp += char.jp

        if (yayuyo.includes(char.jp)) {
          const isShi = chishi.includes(u1.jp.slice(-2, -1))
          u1.roman = u1.roman.slice(0, -1) + char.roman.slice(isShi ? -1 : 0)
        } else u1.roman += char.roman
        return u1
      },
      { jp: '', roman: '' }
    )

    while (question.roman.includes('tsu')) {
      const index = question.roman.at(question.roman.indexOf('tsu') + 3)
      if (index != undefined) question.roman = question.roman.replace('tsu', index)
    }

    question.roman = question.roman.toUpperCase()

    return [...u, question]
  }, [])
}

/**
 * 
1. tidak boleh di awal = ya kecil, yu yo tsu (kecil)
2. tidak boleh di akhir = tsu kecil
3. tidak boleh dobel
4. tidak boleh sebelum
 */
