package wsb.edu.cybquiz.score.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wsb.edu.cybquiz.score.model.ScoreEntity;
import wsb.edu.cybquiz.score.dto.ScoreDto;
import wsb.edu.cybquiz.score.dto.ScoreResponseDto;
import wsb.edu.cybquiz.score.repo.ScoreRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScoreService {

    private final ScoreRepository repo;

    public ScoreResponseDto saveScore(ScoreDto dto) {
        String id = UUID.randomUUID().toString();
        String normalizedGroupId = normalizeId(dto.getGroupId());
        String normalizedUserId = normalizeId(dto.getUserId());
        String normalizedQuizId = normalizeId(dto.getQuizId());

        if (normalizedUserId == null) {
            throw new IllegalArgumentException("userId is required");
        }
        if (normalizedQuizId == null) {
            throw new IllegalArgumentException("quizId is required");
        }

        ScoreEntity entity = ScoreEntity.builder()
                .id(id)
            .groupId(normalizedGroupId)
                .userId(normalizedUserId)
                .quizId(normalizedQuizId)
            .correct(dto.getCorrect())
            .total(dto.getTotal())
            .createdAt(dto.getCreatedAt())
                .build();
        repo.save(entity);
        return new ScoreResponseDto(
            id,
            entity.getGroupId(),
            entity.getUserId(),
            entity.getQuizId(),
            entity.getCorrect(),
            entity.getTotal(),
            entity.getCreatedAt()
        );
    }

    public List<ScoreResponseDto> getScoresByUser(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (normalizedUserId == null) {
            throw new IllegalArgumentException("userId is required");
        }

        return repo.findAll().items().stream()
                .filter(s -> normalizeId(s.getUserId()) != null)
                .filter(s -> normalizedUserId.equals(normalizeId(s.getUserId())))
            .map(s -> new ScoreResponseDto(
                s.getId(),
                s.getGroupId(),
                s.getUserId(),
                s.getQuizId(),
                s.getCorrect(),
                s.getTotal(),
                s.getCreatedAt()
            ))
                .collect(Collectors.toList());
    }

        public List<ScoreResponseDto> getAllScores() {
        return repo.findAll().items().stream()
            .map(s -> new ScoreResponseDto(
                s.getId(),
                s.getGroupId(),
                s.getUserId(),
                s.getQuizId(),
                s.getCorrect(),
                s.getTotal(),
                s.getCreatedAt()
            ))
            .collect(Collectors.toList());
        }

    private String normalizeId(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();
        if (normalized.length() >= 2 && normalized.startsWith("\"") && normalized.endsWith("\"")) {
            normalized = normalized.substring(1, normalized.length() - 1).trim();
        }

        return normalized.isBlank() ? null : normalized;
    }
}
