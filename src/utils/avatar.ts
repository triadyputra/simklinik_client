/**
 * Resolve after `time` has been spend.
 *
 * @param time Time in milliseconds to wait
 */
export function avatar(sex: string) {
  return sex == 'Laki-laki' ? '/images/avatars/male.png' : '/images/avatars/female.png'
}
