from flask import Flask, request, jsonify
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.impute import SimpleImputer
import numpy as np

app = Flask(__name__)

@app.route('/cluster', methods=['POST'])
def cluster():
    data = request.get_json(force=True)
    features = data['features']

    feature_matrix = []
    valid_indices = []
    for i, track in enumerate(features):
        if track is None:
            continue
        feature_matrix.append([
            track['popularity'],
            track['release_year'],
            track['rank_score'],
            track['is_recent_hit'],
            track['is_all_time'],
            track['duration'],
        ])
        valid_indices.append(i)

    X = np.array(feature_matrix, dtype=float)

    # Replace any NaN with column mean
    imputer = SimpleImputer(strategy='mean')
    X = imputer.fit_transform(X)

    scaler = StandardScaler()
    scaled = scaler.fit_transform(X)

    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    labels = kmeans.fit_predict(scaled)

    centers = scaler.inverse_transform(kmeans.cluster_centers_)

    clusters = []
    for i in range(3):
        cluster_tracks = [valid_indices[j] for j, label in enumerate(labels) if label == i]
        center = centers[i]
        clusters.append({
            'cluster_id': i,
            'track_indices': cluster_tracks,
            'center': {
                'popularity': round(float(center[0]), 3),
                'release_year': round(float(center[1]), 3),
                'rank_score': round(float(center[2]), 3),
                'is_recent_hit': round(float(center[3]), 3),
                'is_all_time': round(float(center[4]), 3),
            }
        })

    return jsonify({'clusters': clusters})

if __name__ == '__main__':
    app.run(port=5000, debug=True)