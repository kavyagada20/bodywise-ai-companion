import re
import math
from typing import List, Dict, Any, Optional

class ProductRAGService:
    def __init__(self):
        self.documents: List[Dict[str, Any]] = []
        self.vocabulary: Dict[str, int] = {}
        self.idf: Dict[str, float] = {}
        self.doc_vectors: List[Dict[int, float]] = []

    def _tokenize(self, text: str) -> List[str]:
        # Lowercase, extract alphanumeric words
        words = re.findall(r'\b[a-zA-Z0-9_\-%\.]+\b', text.lower())
        stopwords = {
            "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", 
            "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", 
            "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", 
            "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", 
            "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", 
            "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", 
            "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", 
            "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", 
            "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", 
            "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", 
            "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", 
            "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", 
            "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", 
            "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", 
            "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", 
            "you're", "you've", "your", "yours", "yourself", "yourselves"
        }
        return [w for w in words if w not in stopwords and len(w) > 1]

    def index_products(self, products: List[Dict[str, Any]]):
        """Build chunks and TF-IDF semantic vector space for all products."""
        self.documents = []
        doc_tokens_list = []

        for p in products:
            p_id = p.get("id")
            p_name = p.get("name", "")
            p_cat = p.get("category", "")
            p_concern = p.get("intended_concern", "")
            p_desc = p.get("description", "")
            p_ingredients = p.get("ingredients", "")
            p_actives = p.get("key_actives", "")
            p_usage = p.get("usage_instructions", "")
            p_warnings = p.get("warnings", "")
            p_benefits = p.get("benefits", "")
            p_status = p.get("verification_status", "Verified Be Bodywise Information")
            p_url = p.get("source_url", "https://bebodywise.com")

            # Chunk 1: Overview & Actives
            chunk_overview = (
                f"Product: {p_name}. Category: {p_cat}. Primary Target Concern: {p_concern}. "
                f"Description: {p_desc} Key Actives: {p_actives}. Clinical Benefits: {p_benefits}."
            )
            self.documents.append({
                "product_id": p_id,
                "product_name": p_name,
                "category": p_cat,
                "section": "overview_and_actives",
                "text": chunk_overview,
                "source_url": p_url,
                "verification_status": p_status
            })
            doc_tokens_list.append(self._tokenize(chunk_overview))

            # Chunk 2: Usage & How to Apply
            chunk_usage = (
                f"Product: {p_name}. Usage Instructions & Application Method: {p_usage}. "
                f"Frequency & Best Time to Apply: Recommended routine application steps."
            )
            self.documents.append({
                "product_id": p_id,
                "product_name": p_name,
                "category": p_cat,
                "section": "usage_instructions",
                "text": chunk_usage,
                "source_url": p_url,
                "verification_status": p_status
            })
            doc_tokens_list.append(self._tokenize(chunk_usage))

            # Chunk 3: Ingredients & Scientific Formulation
            chunk_ingredients = (
                f"Product: {p_name}. Detailed Formulation & Ingredients: {p_ingredients}. "
                f"Key Actives: {p_actives}."
            )
            self.documents.append({
                "product_id": p_id,
                "product_name": p_name,
                "category": p_cat,
                "section": "ingredients",
                "text": chunk_ingredients,
                "source_url": p_url,
                "verification_status": p_status
            })
            doc_tokens_list.append(self._tokenize(chunk_ingredients))

            # Chunk 4: Safety, Warnings & Precautions
            chunk_warnings = (
                f"Product: {p_name}. Safety Precautions, Warnings & Contraindications: {p_warnings}."
            )
            self.documents.append({
                "product_id": p_id,
                "product_name": p_name,
                "category": p_cat,
                "section": "safety_and_warnings",
                "text": chunk_warnings,
                "source_url": p_url,
                "verification_status": p_status
            })
            doc_tokens_list.append(self._tokenize(chunk_warnings))

        # Build vocabulary
        vocab = {}
        for tokens in doc_tokens_list:
            for t in tokens:
                if t not in vocab:
                    vocab[t] = len(vocab)
        self.vocabulary = vocab

        # Calculate IDF
        N = len(doc_tokens_list)
        self.idf = {}
        for term, term_idx in self.vocabulary.items():
            df = sum(1 for tokens in doc_tokens_list if term in tokens)
            self.idf[term] = math.log((N + 1) / (df + 1)) + 1.0

        # Build TF-IDF vectors
        self.doc_vectors = []
        for tokens in doc_tokens_list:
            tf = {}
            for t in tokens:
                tf[t] = tf.get(t, 0) + 1
            vec = {}
            length_sq = 0.0
            for t, count in tf.items():
                if t in self.vocabulary:
                    term_idx = self.vocabulary[t]
                    score = (count / len(tokens)) * self.idf[t]
                    vec[term_idx] = score
                    length_sq += score * score
            # Normalize vector
            norm = math.sqrt(length_sq) or 1.0
            norm_vec = {k: v / norm for k, v in vec.items()}
            self.doc_vectors.append(norm_vec)

    def search(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        """Retrieve top-k documents matching the query using cosine similarity."""
        if not self.documents or not self.vocabulary:
            return []

        q_tokens = self._tokenize(query)
        if not q_tokens:
            return []

        # Vectorize query
        q_tf = {}
        for t in q_tokens:
            q_tf[t] = q_tf.get(t, 0) + 1

        q_vec = {}
        length_sq = 0.0
        for t, count in q_tf.items():
            if t in self.vocabulary:
                term_idx = self.vocabulary[t]
                idf_val = self.idf.get(t, 1.0)
                score = (count / len(q_tokens)) * idf_val
                q_vec[term_idx] = score
                length_sq += score * score

        if length_sq == 0:
            # Fallback substring match
            fallback_results = []
            lower_q = query.lower()
            for doc in self.documents:
                if any(w in doc["text"].lower() for w in lower_q.split()):
                    fallback_results.append({
                        "score": 0.5,
                        **doc
                    })
            return fallback_results[:top_k]

        norm = math.sqrt(length_sq) or 1.0
        norm_q_vec = {k: v / norm for k, v in q_vec.items()}

        scores = []
        for i, d_vec in enumerate(self.doc_vectors):
            dot_product = sum(norm_q_vec[k] * d_vec[k] for k in norm_q_vec if k in d_vec)
            if dot_product > 0.03:
                scores.append((dot_product, i))

        scores.sort(key=lambda x: x[0], reverse=True)
        results = []
        for score, idx in scores[:top_k]:
            doc_data = dict(self.documents[idx])
            doc_data["relevance_score"] = round(float(score), 4)
            results.append(doc_data)

        return results

rag_service = ProductRAGService()

