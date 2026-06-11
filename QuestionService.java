package wsb.edu.cybquiz.question.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import wsb.edu.cybquiz.question.dto.QuestionCreateResponseDto;
import wsb.edu.cybquiz.question.dto.QuestionDto;
import wsb.edu.cybquiz.question.mapper.QuestionMapper;
import wsb.edu.cybquiz.question.model.QuestionEntity;
import wsb.edu.cybquiz.question.repo.QuestionRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository repo;
    private final QuestionMapper mapper;

    public void saveQuestion(QuestionDto dto) {
        repo.save(mapper.toEntity(dto));
    }

    public QuestionDto findById(String id) {
        return mapper.toDto(repo.findById(id).orElseThrow());
    }

    public List<QuestionDto> findAll() {
        return repo.findAll().items().stream()
                .map(entity -> mapper.toDto(entity))
                .toList();
    }

    public QuestionCreateResponseDto createQuestion(QuestionDto dto) {
        String id = UUID.randomUUID().toString();
        QuestionEntity entity = mapper.toEntity(dto);
        entity.setId(id);
        repo.save(entity);
        log.info("Saved question id: {}", id);
        return new QuestionCreateResponseDto(id);
    }

    public QuestionDto updateQuestion(QuestionDto dto) {
        if (dto.getId() == null || dto.getId().isBlank()) {
            throw new RuntimeException("Question id is required");
        }

        QuestionEntity existing = repo.findById(dto.getId()).orElseThrow();
        existing.setName(dto.getName());
        existing.setType(dto.getType());
        existing.setCreatedBy(dto.getCreatedBy());
        existing.setContent(dto.getContent());
        repo.save(existing);
        return mapper.toDto(existing);
    }

    public void deleteQuestion(String id) {
        repo.delete(id);
    }

}
