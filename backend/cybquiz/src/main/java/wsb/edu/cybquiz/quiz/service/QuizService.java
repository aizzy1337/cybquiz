package wsb.edu.cybquiz.quiz.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wsb.edu.cybquiz.quiz.dto.*;
import wsb.edu.cybquiz.quiz.model.QuizEntity;
import wsb.edu.cybquiz.quiz.repo.QuizRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository repo;

    public QuizResponseDto create(QuizDto dto) {
        String id = UUID.randomUUID().toString();
        String normalizedCreatedBy = normalizeUserId(dto.getCreatedBy());

        QuizEntity entity = QuizEntity.builder()
                .id(id)
                .title(dto.getTitle())
            .createdBy(normalizedCreatedBy)
                .questionIds(dto.getQuestionIds())
                .build();

        repo.save(entity);

        return new QuizResponseDto(id, dto.getTitle(), normalizedCreatedBy, dto.getQuestionIds());
    }

    public List<QuizResponseDto> findByCreator(String userId) {
        String normalizedUserId = normalizeUserId(userId);
        if (normalizedUserId == null) {
            return List.of();
        }

        return repo.findAll().items().stream()
            .filter(q -> normalizedUserId.equals(normalizeUserId(q.getCreatedBy())))
                .map(q -> new QuizResponseDto(q.getId(), q.getTitle(), q.getCreatedBy(), q.getQuestionIds()))
                .toList();
    }

    public List<QuizResponseDto> findAll() {
        return repo.findAll().items().stream()
                .map(q -> new QuizResponseDto(q.getId(), q.getTitle(), q.getCreatedBy(), q.getQuestionIds()))
                .collect(Collectors.toList());
    }

    public QuizResponseDto update(String id, QuizDto dto) {
        QuizEntity entity = repo.findById(id).orElseThrow();

        entity.setTitle(dto.getTitle());
        entity.setQuestionIds(dto.getQuestionIds());
        repo.save(entity);

        return new QuizResponseDto(id, entity.getTitle(), entity.getCreatedBy(), entity.getQuestionIds());
    }

    public void delete(String id) {
        repo.delete(id);
    }

    private String normalizeUserId(String userId) {
        if (userId == null) {
            return null;
        }

        String normalized = userId.trim();
        if (normalized.length() >= 2 && normalized.startsWith("\"") && normalized.endsWith("\"")) {
            normalized = normalized.substring(1, normalized.length() - 1).trim();
        }

        return normalized.isBlank() ? null : normalized;
    }
}
