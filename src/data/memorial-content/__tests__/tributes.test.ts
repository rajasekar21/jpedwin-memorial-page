import { memorialContent } from '../index';

describe('localized tribute content', () => {
  it('keeps the Tamil tribute list aligned with the English source', () => {
    expect(memorialContent.ta.tributes).toHaveLength(memorialContent.en.tributes.length);
    expect(memorialContent.ta.tributes.map((tribute) => tribute.name)).toEqual([
      'ஜே. பி. ஜான்ஸன் சந்திரசேகர்',
      'டாக்டர் எஸ். ஜெயக்குமார்',
      'மறைத்திரு. ஜேக்கப் வின்சிலின்',
      'எம். ரவிச்சந்திரன்',
      'திருமதி. ஹெலன் பிரிஸ்கில்லா பாய்',
      'ஆர். ஐரீன் சிந்தியா'
    ]);
  });
});
