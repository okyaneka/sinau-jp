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
  if (tsu.includes(char) && aiueo.includes(v.jp)) return false
  if (tsu.includes(v.jp) && (tsu.includes(char) || !char || lastChar)) return false
  if (yayuyo.includes(v.jp) && (!char || !yayuyoyes.includes(char))) return false
  return true
}

/**
 *
 * @param type
 * @param gaku
 * @param onsetsu
 * @returns
 */
export function questionGenerate(
  type: QuestionChar['type'],
  gaku: number,
  onsetsu: number
): Question[] {
  const moji = questionChars.filter((v) => v.type == type)
  const tsuChar = moji.find((v) => tsu.includes(v.jp)) as QuestionChar
  const yayuyoChar = moji.filter((v) => yayuyo.includes(v.jp))
  moji.splice(
    Math.floor(Math.random() * moji.length),
    0,
    ...new Array(Math.floor((10 / 100) * moji.length)).fill(0).map((v) => tsuChar)
  )
  moji.splice(
    Math.floor(Math.random() * moji.length),
    0,
    ...new Array(Math.floor(((yayuyoyes.length / questionChars.length) * 100) / 2))
      .fill(0)
      .map(() => yayuyoChar)
      .reduce((cur, car) => [...cur, ...car], [])
  )

  /**
   * peluang/jaminan karakter yang "belum terambil" meningkat ketika ada karakter yang terambil lebih dari satu kali
   *
   * step
   * 1. mencari data karakter dan jumlah terambilnya
   *
   */

  return new Array(gaku).fill(0).reduce<Question[]>((car, cur) => {
    const picked = moji.map((v) => {
      const picked = car
        .map((v1) => v1.jp)
        .join('')
        .split('')
        .filter((v1) => v1 == v.jp).length
      return {
        char: v,
        picked
      }
    })
    const twices = picked.filter((v) => v.picked > 1)

    const question = new Array(onsetsu).fill(0).reduce<Question>(
      (car2, cur2, i) => {
        const chars = moji.filter((v) => filterChar(car2.jp.slice(-1), v, i + 1 == onsetsu))
        const YAYUYO = moji.filter((v) => yayuyo.includes(v.jp))
        const indexes = new Array(chars.length).fill(0).map((v, i) => i)

        const useYayuyo = yayuyoyes.some((v) => v == car2.jp) && Math.random() * 2 > 1
        if (twices.length) {
          picked
            .filter((v) => v.picked == 0)
            .forEach((v) => {
              const index = chars.findIndex((v1) => v1.jp == v.char.jp)
              if (index != -1) indexes.push(index)
            })
        }
        const char = useYayuyo
          ? YAYUYO[Math.floor(Math.random() * YAYUYO.length)]
          : chars[indexes[Math.floor(Math.random() * indexes.length)]]

        car2.jp += char.jp

        if (yayuyo.includes(char.jp)) {
          const isShi = chishi.includes(car2.jp.slice(-2, -1))
          car2.roman = car2.roman.slice(0, -1) + char.roman.slice(isShi ? -1 : 0)
        } else car2.roman += char.roman
        return car2
      },
      { jp: '', roman: '' }
    )

    while (question.roman.includes('tsu')) {
      const index = question.roman.at(question.roman.indexOf('tsu') + 3)
      if (index != undefined) question.roman = question.roman.replace('tsu', index)
    }

    question.roman = question.roman.toUpperCase()

    return [...car, question]
  }, [])
}

/**
 * 
1. tidak boleh di awal = ya kecil, yu yo tsu (kecil)
2. tidak boleh di akhir = tsu kecil
3. tidak boleh dobel
4. tidak boleh sebelum
 */
