package wsb.edu.cybquiz.question.mapper;

import org.springframework.stereotype.Component;

import wsb.edu.cybquiz.question.dto.QuestionDto;
import wsb.edu.cybquiz.question.model.QuestionEntity;

@Component
public class QuestionMapper {

    public QuestionDto toDto(QuestionEntity entity) {
        return QuestionDto.builder()
                .id(entity.getId())
                .content(entity.getContent())
                .type(entity.getType())
                .name(entity.getName())
                .createdBy(entity.getCreatedBy())
                .build();
    }

    public QuestionEntity toEntity(QuestionDto dto) {
        return QuestionEntity.builder()
                .id(dto.getId())
                .content(dto.getContent())
                .type(dto.getType())
                .name(dto.getName())
                .createdBy(dto.getCreatedBy())
                .build();
    }

}
