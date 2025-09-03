import whisper
from collections import Counter

def summarize_text(text, sentence_count=5):
    """
    Çok basit bir özetleyici:
    - En sık geçen kelimelere göre cümleleri puanlıyor
    - En yüksek puanlı cümlelerden özet çıkarıyor
    """
    sentences = text.split(". ")
    words = text.lower().split()
    word_freq = Counter(words)

    sentence_scores = {}
    for sent in sentences:
        for word in sent.split():
            if word.lower() in word_freq:
                sentence_scores[sent] = sentence_scores.get(sent, 0) + word_freq[word.lower()]

    ranked_sentences = sorted(sentence_scores, key=sentence_scores.get, reverse=True)
    return ". ".join(ranked_sentences[:sentence_count])

def transcribe_and_summarize(audio_file):
    print("⏳ Model yükleniyor...")
    model = whisper.load_model("small")  # "tiny", "base", "small", "medium", "large" seçenekleri var
    print("🎤 Ses transkribe ediliyor...")
    result = model.transcribe(audio_file, language="en")

    transcript = result["text"]
    print("\n📜 Tam Transkript:\n")
    print(transcript)

    print("\n📝 Özet:\n")
    summary = summarize_text(transcript, sentence_count=5)
    print(summary)

    # Kaydet
    with open("transkript.txt", "w", encoding="utf-8") as f:
        f.write(transcript)

    with open("ozet.txt", "w", encoding="utf-8") as f:
        f.write(summary)

    print("\n✅ 'transkript.txt' ve 'ozet.txt' dosyaları oluşturuldu.")

if __name__ == "__main__":
    # Buraya kendi dosya adını yaz
    transcribe_and_summarize("mktg301_assignment3.mp4")