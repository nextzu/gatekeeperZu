import whisper
from collections import Counter
import streamlit as st
import tempfile
import os
import time

# -----------------------
# Helper: Summarizer
# -----------------------
def summarize_text(text, sentence_count=5):
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

# -----------------------
# Streamlit UI
# -----------------------
st.title("🎤 Audio Transcriber & Summarizer")
st.write("Upload an audio or video file, and this app will transcribe it and generate a summary.")

uploaded_file = st.file_uploader("Choose an audio/video file", type=["mp3", "wav", "mp4", "m4a"])

if uploaded_file is not None:
    # Save uploaded file to temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(uploaded_file.name)[1]) as temp_file:
        temp_file.write(uploaded_file.read())
        temp_path = temp_file.name

    # Load Whisper model
    with st.spinner("⏳ Loading Whisper model..."):
        model = whisper.load_model("small")

    # Transcription with progress
    st.info("🎤 Transcribing audio...")
    progress_bar = st.progress(0)
    text_placeholder = st.empty()

    # Whisper doesn't provide progress natively, so we fake a progress bar
    result = model.transcribe(temp_path, language="en")
    transcript = result["text"]

    for i in range(100):
        time.sleep(0.01)  # Small sleep to simulate progress
        progress_bar.progress(i + 1)

    text_placeholder.text("✅ Transcription Complete!")

    # Show full transcript
    st.subheader("📜 Full Transcript")
    st.text_area("Transcript", transcript, height=300)

    # Generate and show summary
    st.subheader("📝 Summary")
    summary = summarize_text(transcript, sentence_count=5)
    st.text_area("Summary", summary, height=200)

    # Download buttons
    st.download_button("Download Transcript", transcript, file_name="transcript.txt")
    st.download_button("Download Summary", summary, file_name="summary.txt")

    # Clean up temp file
    os.remove(temp_path)
